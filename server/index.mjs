// imports
import express from 'express';
import morgan from 'morgan'; // logging middleware
import cors from 'cors'; // CORS middleware
import {check, validationResult, body} from 'express-validator';
import MemeDAO from './dao/memeDAO.mjs';
import UserDao from './dao/userDAO.mjs';
import GameDAO from './dao/gameDAO.mjs';

// init express
const app = new express();
const port = 3001;

app.use(morgan('dev'));
app.use(express.json());

/** Set up and enable Cross-Origin Resource Sharing (CORS) **/
const corsOptions = {
    origin: 'http://localhost:5173',
    credentials: true
};
app.use(cors(corsOptions));

const memeDao = new MemeDAO();
const userDao = new UserDao();
const gameDAO = new GameDAO();

/** Authentication-related imports **/
import passport from 'passport';                              // authentication middleware
import LocalStrategy from 'passport-local';                   // authentication strategy (username and password)

/** Set up authentication strategy to search in the DB a user with a matching password.
 * The user object will contain other information extracted by the method userDao.getUserByCredentials() (i.e., id, username, name).
 **/
passport.use(new LocalStrategy({ usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true,
  }, async function verify(req, username, password, callback) {
    const name = req.body.name;
    const surname = req.body.surname;
    const user = await userDao.getUserByCredentials(username, name, surname, password)
    if(!user)
      return callback(null, false, { message : 'Incorrect username or password' });

    return callback(null, user); // NOTE: user info in the session (all fields returned by userDao.getUserByCredentials(), i.e, id, username, name)
}));

// Serializing in the session the user object given from LocalStrategy(verify).
passport.serializeUser(function (user, callback) { // this user is id + username + name
    callback(null, user);
});

// Starting from the data in the session, we extract the current (logged-in) user.
passport.deserializeUser(function (user, callback) { // this user is id + email + name
    return callback(null, user); // this will be available in req.user

    // In this method, if needed, we can do extra check here (e.g., double check that the user is still in the database, etc.)
    // e.g.: return userDao.getUserById(id).then(user => callback(null, user)).catch(err => callback(err, null));
});


/** Creating the session */
import session from 'express-session';

app.use(session({
  secret: "This is a very secret information used to initialize the session!",
  resave: false,
  saveUninitialized: false,
}));
app.use(passport.authenticate('session'));


/** Defining authentication verification middleware **/
const isLoggedIn = (req, res, next) => {
    if(req.isAuthenticated()) {
      return next();
    }
    return res.status(401).json({error: 'Not authorized'});
}

/*** Users APIs ***/

// POST /api/sessions

const onValidationErrors = (validationResult, res) => {
  const errors = validationResult.formatWith(errorFormatter);
  return res.status(422).json({validationErrors: errors.mapped()});
};

// Only keep the error message in the response
const errorFormatter = ({msg}) => {
  return msg;
};

app.post('/api/sessions/registration', async (req, res, next) => {
  try {

    const username = req.body.username;
    const password = req.body.password;
    const name = req.body.name;
    const surname = req.body.surname;
    
    // Check if username is already in use
    const existingUser = await userDao.getUserByUsername(username);
    if (existingUser) {
      return res.status(400).json({ error: 'Username already in use' });
    }

    // Register the user
    const user = await userDao.registerUser(username, name, surname, password);

    // Authenticate the user
    req.login(user, (err) => {
      if (err) {
        return next(err);
      }
      
      // Redirect the user to the home page
      return res.json(req.user);
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to register user' });
  }
});

// This route is used for performing login.
app.post('/api/sessions', function(req, res, next) {

  passport.authenticate('local', (err, user, info) => {
    if (err)
      return next(err);
      if (!user) {
        // display wrong login messages
        return res.status(401).json({ error: info});
      }
      // success, perform the login and extablish a login session
      req.login(user, (err) => {
        if (err)
          return next(err);

        // req.user contains the authenticated user, we send all the user info back
        // this is coming from userDao.getUserByCredentials() in LocalStratecy Verify Function
        return res.json(req.user);
      });
  })(req, res, next);
});

// GET /api/sessions/current
// This route checks whether the user is logged in or not.
app.get('/api/sessions/current', (req, res) => {
  if(req.isAuthenticated()) {
    res.status(200).json(req.user);}
  else
    res.status(401).json({error: 'Not authenticated'});
});

// DELETE /api/session/current
// This route is used for loggin out the current user.
app.delete('/api/sessions/current', (req, res) => {
  req.logout(() => {
    res.end();
  });
});

/*** Memes APIs ***/
// 1. Retrieve a random meme
app.post('/api/meme-with-captions', async (req, res) => {
    try {
        const pastMemes = req.body.pastMemes;

        const meme = await memeDao.getRandomMeme(pastMemes);
        const bestCaptions = await memeDao.getCaptionsForMeme(meme); //array of bestMatches
        const otherCaptions = await memeDao.getNonMatchingCaptions(meme, bestCaptions); //array of nonBestMatches

        // Combine best and other captions, shuffle them
        const allCaptions = [...bestCaptions, ...otherCaptions];
        const shuffledCaptions = allCaptions.sort(() => Math.random() - 0.5);

        res.json({
            meme: meme,
            captions: shuffledCaptions,
        });
    } catch (err) {
      res.status(500).json({ error: 'Failed to get meme data' });
        
    }
});

app.get('/api/users/:username/games', isLoggedIn, async (req, res) => {
  try{
    const username = req.params.username;
    const games = await gameDAO.getUserGames(username)
    games.sort((a, b) => a.gameID - b.gameID);
    if(games.length === 0){
      res.json([])
    }else{
      res.json(games)
    }
  }catch(err){
    res.json([])
  }

});

app.post('/api/total-score', isLoggedIn, 
  async (req, res) => {
  try{
    const username = req.body.username;
    const totalScore = await gameDAO.getUserTotalScore(username)
    res.json({totalScore})
  }catch(err){
    res.status(500).json({ error: 'Failed to get total score' });
  }
});

app.post('/api/create-game', isLoggedIn, async (req, res) => {
  try{
    const username = req.body.username;
    console.log(username)
    const gameID = await gameDAO.createGame(username);
    res.json({gameID})
  }catch(err){
    res.status(500).json({ error: 'Failed to create game' });
  }
});

app.post('/api/save-round', isLoggedIn, async (req, res) => {
  try{
    const gameID = req.body.gameID;
    const username = req.body.username;
    const roundNumber = req.body.roundNumber;
    const score = req.body.score;
    const meme = req.body.meme;
    const caption = req.body.caption;
    await gameDAO.saveRound(gameID, username, meme, caption, roundNumber, score);
    res.end();
  }catch(err){
    res.status(500).json({ error: 'Failed to save round' });
  }
});

app.post('/api/check-best-match', async (req, res) => {
  try{
    const meme = req.body.meme;
    const captionID = req.body.captionID;
    const isBestMatch = await memeDao.checkBestMatch(meme, captionID);
    res.json({isBestMatch})
  }catch(err){
    res.status(500).json({ error: 'Failed to check best match' });
  }
});

app.post('/api/best-captions', async (req, res) => {
  try{
    const meme = req.body.meme;
    const captions = req.body.captions;
    const bestCaptions = await memeDao.getBestCaptions(meme, captions);
    res.json({bestCaptions})
  }catch(err){
    res.status(500).json({ error: 'Failed to get best captions' });
  }
});

// 2. Retrieve all meme URLs
// app.get('/api/memes', async (req, res) => {
//     try {
//         const memes = await memeDao.getAllMemes();
//         res.json(memes);
//     } catch (err) {
//         res.status(500).json({ error: 'Failed to get memes data' });
//     }
// });
  
app.listen(port, () => console.log(`Server running on port ${port}`));