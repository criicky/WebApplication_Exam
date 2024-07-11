import { useState, useEffect } from 'react';
import {Container} from 'react-bootstrap/';
import { Route, Routes, Navigate, useLocation, useNavigate } from 'react-router-dom';
import API from './API'; // Assuming API is defined in a separate file
import Game from './components/Game';
import HomePage from './components/HomePage';
import RegisterForm from './components/Registration';
import GameHistory from './components/GameHistory';
import GameOver from './components/GameOver';
import { LoginForm } from './components/Auth';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

const App = () => {
  const [meme, setMeme] = useState(null);
  const [captions, setCaptions] = useState([]);
  const [selectedCaption, setSelectedCaption] = useState(null);
  const [roundNumber, setRoundNumber] = useState(1);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [timerInterval, setTimerInterval] = useState(null);
  const [remainingTime, setRemainingTime] = useState(30); // New state variable for remaining time
  const [user, setUser] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false); // Assume user is logged in
  const [registered, setRegistered] = useState(false);
  const [games, setGames] = useState([]);
  const [pastMemes, setPastMemes] = useState([]);
  const [anonymously, setPlayAnonymously] = useState(false);
  const [pastCaptions, setPastCaptions] = useState([]);
  const [pastScores, setPastScores] = useState([]);
  const [totscore, setTotScore] = useState(0);
  const [pastGame, setPastGame] = useState([]);
  const [isPaused, setIsPaused] = useState(false);
  const [bestCaptions, setBestCaptions] = useState([]);
  const [correct, setCorrect] = useState(false);

  useEffect(() => {
    // Checking if the user is already logged-in
    // This useEffect is called only the first time the component is mounted (i.e., when the page is (re)loaded.)
    API.getUserInfo()
        .then(user => {
            setLoggedIn(true);
            setUser(user);  // here you have the user info, if already logged in
        }).catch(e => {
            if(loggedIn)    // printing error only if the state is inconsistent (i.e., the app was configured to be logged-in)
                console.log("User not logged in. Error: ", e);
            setLoggedIn(false); setUser(null);
        }); 
}, []);

  useEffect(() => {

    if(roundNumber > 1){
      // Any other actions you want to perform when roundNumber changes.
      if(loggedIn === true){
        /*if(selectedCaption === null){
          console.log("IM HERE")
          setPastCaptions(pastCaptions => {
            const updatedPastCaptions = [...pastCaptions, " "];
            return updatedPastCaptions;
          });
          setPastScores([...pastScores, 0]);
        }*/
        if(roundNumber > 3){
          //saveRounds();
          setGameOver(true);
          handleGameOver();
        }
        else{
          //setIsPaused(true);
          fetchMemeAndStartTimer();
        }
      }
      else if(anonymously === true){
        if(roundNumber > 1){
          setGameOver(true);
          navigate("/game-over");
        }
        else{
          //setIsPaused(true);
          fetchMemeAndStartTimer();
        }
      }
    }
  }, [roundNumber]);

  useEffect(() => {

    const retrieveBestCaptions = async () => {
      const data = await API.getBestCaptions(meme, captions);
      setBestCaptions(data.bestCaptions);
    }

    if (isPaused) {
      if(correct === false)retrieveBestCaptions();
      else{
        setBestCaptions([selectedCaption]);
      }
      setTimeout(() => {
        setRoundNumber(roundNumber + 1);
        setIsPaused(false);
      }, 5000); // 5 seconds pause 5000
    }
  }, [isPaused]);

  const fetchMemeAndStartTimer = async () => {
    try {
      const data = await API.getMemeWithCaptions(pastMemes);
      const newMeme = data.meme;
      setMeme(prevMeme => { return newMeme });
      setPastMemes(prevPastMemes => {
        const updatedPastMemes = [...prevPastMemes, newMeme];
        return updatedPastMemes;
      });
      setCaptions(await data.captions);
      setSelectedCaption(null);
      setCorrect(false);
      startTimer(newMeme,pastCaptions);
    } catch (error) {
      console.error('Error fetching meme and captions:', error);
    }
  };

  const startTimer = (newMeme, pastCaptions) => {
    clearInterval(timerInterval); // Clear any existing timer
    setRemainingTime(30); // Reset remaining time to 30 seconds

    const endTime = new Date().getTime() + 30000; // 30 seconds from now
    const newInterval = setInterval(() => {
      const now = new Date().getTime();
      const timeLeft = Math.max(0, (endTime - now) / 1000); // Convert to seconds
      setRemainingTime(timeLeft);
      if (timeLeft <= 0) {
        //setRoundNumber(roundNumber + 1);
        if(pastCaptions.length < roundNumber){
          setPastCaptions(pastCaptions => {
            const updatedPastCaptions = [...pastCaptions, " "];
            return updatedPastCaptions;
          }
          );
          setPastScores(pastScores => {
            const updatedPastScores = [...pastScores, 0];
            return updatedPastScores;
          } 
          );
        }
        if(roundNumber === 3 && loggedIn === true){
          saveRounds(newMeme,null, 0);
        }
        setIsPaused(true);
        clearInterval(newInterval);
      }
    }, 1000);

    setTimerInterval(newInterval);
  };

  const saveRounds = async (meme, caption, sc) => {
    const data = await API.createGame(user.username);
    const id = data.gameID;
    await API.saveRound(id, user.username, pastMemes[0], pastCaptions[0], 1, pastScores[0]);
    await API.saveRound(id, user.username, pastMemes[1], pastCaptions[1], 2, pastScores[1]);
    await API.saveRound(id, user.username, meme, caption === null ? "" : caption.text, 3, sc);
  }

  const handleCaptionClick = async (caption) => {
    if (selectedCaption !== null || remainingTime <= 0) {
      return;
    }
    setSelectedCaption(caption);
    setPastCaptions(pastCaptions => {
      const updatedPastCaptions = [...pastCaptions, caption.text];
      return updatedPastCaptions;
    }
    );
    
    const data = await API.checkBestMatch(meme, caption.id);
    const isCorrect = data.isBestMatch;
    let sc = 0;
    if (isCorrect) {
      setScore(score + 5);
      sc = 5;
      setPastScores(pastScores => {
        const updatedPastScores = [...pastScores, 5];
        return updatedPastScores;
      } 
      );
      setCorrect(true);
      //setRoundNumber(roundNumber + 1);
    } else {
      setPastScores(pastScores => {
        const updatedPastScores = [...pastScores, 0];
        return updatedPastScores;
      } 
      );
    }

    if(roundNumber === 3 && loggedIn === true){
      saveRounds(meme, caption, sc);
    }

    setIsPaused(true);
    //
    clearInterval(timerInterval); // Stop the timer
    setRemainingTime(0); // Set remaining time to 0
  };

  const navigate = useNavigate();
  const location = useLocation();

  const startGame = async (statusLogin) => {
    setRoundNumber(1); // Reset round number
    setGameOver(false);
    setMeme(null);
    setCaptions([]);
    setIsPaused(false);
    setPastMemes([]);
    setPastCaptions([]);
    setPastScores([]);
    setPastGame([]);
    setTotScore(0);
    setScore(0);
    clearInterval(timerInterval);
    setRemainingTime(30);
    setLoggedIn(statusLogin); // I need to pass this as a prop to the Game component so i can use the play anonymously button
    await fetchMemeAndStartTimer(); // Fetch the first meme and start the timer
    navigate("/meme-with-captions");
  };

  const handleLogin = async (credentials) => {
    const user = await API.logIn(credentials);
    setUser(user); setLoggedIn(true);
  };

  const handleRegistration = async (credentials) => {
    const user = await API.register(credentials);
    setUser(user); setRegistered(true);
    setLoggedIn(true);
  };

  const gameHistory = async (username) => {
    const data = await API.getUserTotalScore(username);
    let totscore = data.totalScore;
    const games = await API.getUserGames(username);
    setGames(games);
    setTotScore(await totscore);
    navigate(`/users/${username}/games`);
  }

  const playAnonymously = (username) => {
    const user = { username : username }
    setUser(user)
    setGames([]);
    setPastMemes([]);
    setLoggedIn(false);
    setRegistered(false);
    setPlayAnonymously(true);
    navigate("/home");
  }

  const handleLogout = async () => {
    API.logOut();
    setUser(null);
    setLoggedIn(false);
    setRegistered(false);
    setPlayAnonymously(false);
    setPastGame([]);
    await setPastMemes([]);
    setPastCaptions([]);
    setPastScores([]);
    setPastGame([]);
    setTotScore(0);
    setScore(0);
    setRoundNumber(1);
    setGameOver(false);
    setMeme(null);
    navigate("/login");
  }

  const handleQuitGame = async () => {
    setGameOver(false);
    setMeme(null);
    setSelectedCaption(null);
    setCaptions([]);
    setIsPaused(false);
    setRoundNumber(0);
    setPastMemes([]);
    setPastCaptions([]);
    setPastScores([]);
    setPastGame([]);
    setTotScore(0);
    setScore(0);
    clearInterval(timerInterval);
    setRemainingTime(30);
    navigate("/home");
  }

  const handleGameOver = async () => {

    let newPastGame = [];

    if(pastMemes.length !== 3)
    await setPastMemes([...pastMemes, meme]);

    if(pastCaptions.length !== 3)
    await setPastCaptions([...pastCaptions, selectedCaption === null ? "" : selectedCaption.text]);
    
    if(pastScores.length !== 3)
    await setPastScores([...pastScores, score]);

    for(let i = 0; i < pastMemes.length; i++){
      if(pastScores[i] === 5){
        newPastGame.push({ roundOfGame: i+1, meme: pastMemes[i], caption : pastCaptions[i], score: pastScores[i]});
      }
    }

    await setPastGame([...pastGame, ...newPastGame]);

    navigate("/game-over");

  }

  const getBackground = () => {
    const loc = location.pathname;

    if(user){
      if(loc === `/users/${user.username}/games`)
        return{
          backgroundImage: 'url(/app-images/gameHistory.jpg)',
        };
    }

    switch(loc){
      case "/login":
        return{
          backgroundImage: 'url(../app-images/loginbg.jpg)',
        };
      case "/home":
        return{
          backgroundImage: 'url(../app-images/home.jpg)',
        };
      case "/registration":
        return{
          backgroundImage: 'url(../app-images/loginbg.jpg)',
        };
      case "/meme-with-captions":
        return{
          backgroundImage: 'url(../app-images/gameTime.jpg)',
        }
      case "/game-over":
          if(score === 0){
            return{
              backgroundImage: 'url(../app-images/gameOver0.jpg)',
            }
          }
          if(score === 15){
            return{
              backgroundImage: 'url(../app-images/gameOver15.jpg)',
            }
          }
          if(score === 10){
            return{
              backgroundImage: 'url(../app-images/gameOver10.jpg)',
            }
          }
          if(score === 5){
            return{
              backgroundImage: 'url(../app-images/gameOver5.jpg)',
            }
          }
        break;
      default:
        return{
          backgroundImage: 'url(../app-images/history.jpg)',
        };
  }
  }

  return (
    <div className="min-vh-100 d-flex flex-column" style={
      {
        backgroundImage: getBackground().backgroundImage,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }
    }>
      <Container fluid className="flex-grow-1 d-flex flex-column min-w-80">
        <Routes>
      
          <Route path="/login" element={
            (loggedIn && !anonymously) ? <Navigate replace to='/home' />
              : <LoginForm login={handleLogin}
                        playAnonymously={playAnonymously}/>
          } />

          <Route path="/home" element={

            <HomePage startGame={startGame}
                  username={user?.username}
                  loggedIn={loggedIn}
                  gameHistory={gameHistory}
                  handleLogout={handleLogout}
            />

          }/>

          <Route path="/users/:username/games" element={
            <GameHistory username={user?.username} 
                  games={games}
                  totscore={totscore}
            />
          }/>

          <Route path="/meme-with-captions" element={
              <Game handleCaptionClick={handleCaptionClick} 
                meme={meme} 
                remainingTime={remainingTime} 
                gameOver={gameOver} 
                captions={captions}
                selectedCaption={selectedCaption}
                roundNumber={roundNumber}
                score={score}
                pastMemes={pastMemes}
                bestCaptions={bestCaptions}
                isPaused={isPaused}
                handleQuitGame={handleQuitGame}
                correct={correct}
              />
              
            }
          />

          <Route path="/game-over" 
            element={
              <GameOver pastGame={pastGame} 
                score={score} 
                handleLogout={handleLogout} 
                loggedIn={loggedIn}
                startGame={startGame}
              />
            }
          />

          <Route path="*" element={
              (loggedIn && !anonymously) ? <Navigate replace to='/home' />
              : <Navigate replace to='/login' />
          } />

          <Route path="/registration" element={
              (registered && !anonymously) ? <Navigate replace to='/home' />
              : <RegisterForm handleRegistration={handleRegistration} />
          }/>

        </Routes>
      </Container>
    </div>
  );
};

export default App;