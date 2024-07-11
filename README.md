[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-24ddc0f5d75046c5622901739e7c5dd533143b0c8e959d652212380cedb1ea36.svg)](https://classroom.github.com/a/AVMm0VzU)
# Exam #1: "Meme Game"
## Student: s331482 Scanu Riccardo 

## React Client Application Routes

- Route `*`: starting page thats gets the user in the login page
- Route `/login` contains the login form, from here a user can register by clicking in the register button, login or play as an anonymous player. Has login, playAnonymously and startGame function access
- Route `/registration` page where theres a form for the user to fill to register and if everything goes smoothly the user gets sent to the home page, ready to play
- Route `/home` page where a player (anonymous or not) can either start a game or logout, the logged in play has access to a button that lets him see the game history. Has access to username of the user, a boolean that says if its logged in or not; startGame, gameHistory and handleLogout functions
- Route `/users/:username/games` page that shows the game history of a logged in player. This page gets created dynamically using the username of the player. Has access to the username, logged in boolean, games that the user player and the total score
- Route `/meme-with-captions` its the game page where the memes and the captions are shown. Has access to the current meme, remaining time, game over boolean, captions to display, selected captions, round number, score, past memes, logged in boolean, handle logout, bestcaptions and if the game is in pause
- Route `/game-over` page that shows the final score the correct captions that a player selected and gives him the possibility to start a new game or logout. Has access to the game that the user just played, score, logged in boolean; start game and handle logout functions



## Main React Components

- `LoginForm` (in `Auth.jsx`)
  - `Purpose`: designed to handle user authentication by providing a form where users can enter their credentials to log into the application. Displays error messages using a bootrstrap Alert component if the login attempt fails, providing a feedback to the user. Includes a button for playing anonymously.
  - `Main Functionality`:
      - `Form Handling`: handles form submissions via the handleSubmit function, which constructs a credentials object and calls the login function passed via props.
      - `Navigation`: uses useNavigate from React to navigate the user to the home page upon successful login (also if they want to play anonymously) or to the registration page if they need to create a new account.
- `RegisterForm` (in `Registration.jsx`)
  - `Purpose`: provides a registration form for new users to create an account. It includes fields for username, first name, second name, password and confirm password (it also checks validation to ensure that password match).
  - `Main Functionality`:
      - `Form Handling`: handles form submissions via the handleSubmit function, which constructs a user object and calls the handleRegistration function passed via props. 
      - `Navigation`: uses useNavigate from React to navigate the user to the home page upon successful registration.
- `Game` (in `Game.jsx`)
  - `Purpose`: designed to provide the core gameplay interface for the game. It displays a meme with the possible captions, allows the player to select a caption and shows the current round, score and remaining time.
  - `Main Functionality`:
      - `Dynamic Styling`: uses the getButtonStyle function to apply conditional styles to caption buttons based on the game state (i.e. at the end of the round gives a green color to the correct captions if a user did not select one or he wrong guessed).
      - `Timer Display`: the timerDisplay function dynamically renders different elements based on the game state ( isPaused, correct, remainingTime and selectedCaption ). This function updates the display to show remaining time, correct or incorrect messages or a timer expired message.
      - `Event Handling`: handles caption clicks via the handleCaptionClick function and includes a quit button that triggers handleQuitGame function, allowing the player to exit the game.
- `GameHistory` (in `GameHistory.jsx`)
  - `Purpose`: designed to display a user's game history, including detailed information about each game and round. It provides an overview of the user's total score and allows navigation back to the home page.
  - `Main Functionality`:
      - `Layout`: dynamically renders game history based on the presence of game data. Uses Bootstrap for layout and styling, displaying the game history in a scrollable list. Each game is displayed with its id and the score, each round of the game shows details round number, meme, caption and score.
      - `Navigation`: uses useNavigate hook from React to navigate back to the home page.
- `GameOver` (in `GameOver.jsx`)
  - `Purpose`: designed to display the final game results to the user. It shows the toal score, a summary of each round played in the game (only for logged in players) and provides the possibility to start a new game, return to the home page or logout.
  - `Main Functionality`:
      - `Layout`: displays a list of round played if the player got the caption right, with details including round number, meme and selected caption.
      - `Navigation`: uses useNavigate hook from React to navigate back to the home page. The handleBack function triggers the handleLogout callback.
- `HomePage` (in `HomePage.jsx`)
  - `Purpose`: serves as the landing page for users, providing them with options to start a new game, view game history (only logged in users) and log out. Additionally, it offers a button to display the game rules with a pop un messages when clicking the info button.
  - `Main Functionality`: handles events like start a new game, show game history and logout.

(only _main_ components, minor ones may be skipped)


## API Server

- POST `/api/sessions/registration` : handles the registration of a user
  - recieves: username, password, name and surname
  - returns the user object or an error
  - response status codes and possible errors:
      - 400 if the username already exists
      - 500 if failed to register him
      - invalid credentials
      - database error
      - malformed user 
      - issues with session
- POST `/api/sessions`: purpose used for perfoming login
  - recieves: user
  - response body content: user if he gets authenticated
  - response status codes and possible errors:
      - invalid credentials
      - database error
      - malformed user 
      - issues with session
- GET `/api/sessions/current`: used to check whether the user is logged in or not
  - request parameters: secret, resave, saveUninitialized
  - response body content: user if its authenticated
  - response status codes and possible errors:
      - 200 for authenticated user
      - 401 not authenticated
- POST `/api/meme-with-captions`: purpose retrieves and sends a random meme with the captions to display and a start time 
  - request body content: pastMemes
  - response body content: meme, captions, starttime
  - response status codes and possible errors:
      - 500 failed to get meme
- GET `/api/users/:username/games`: purpose send all the games that a user played and finished
  - middleware : isLoggedin only logged in users can access this api so this will check it
  - request parameters: username
  - response body content: all the games played
  - response status codes and possible errors:
      - empty array if nothing was found
- POST `/api/total-score`: purpose to send the total score of all games of a user
  - middleware : isLoggedin only logged in users can access this api so this will check it
  - request body content: username of the user
  - response body content: total score 
  - response status codes and possible errors:
      - 500 failed to get total score
- POST `/api/create-game`: purpose to create a game for a completed game and send back the id of it
  - middleware : isLoggedin only logged in users can access this api so this will check it
  - request body content: username of the user
  - response body content: id of the game
  - response status codes and possible errors:
      - 500 failed to get create game
- POST `/api/save-round`: purpose to save the round in the db
  - middleware : isLoggedin only logged in users can access this api so this will check it
  - request body content: username of the user, game id, meme, caption selected (could be empty), number of the round and score 
  - response status codes and possible errors:
      - 500 failed to save the round
- POST `/api/check-best-match`: purpose to check if a caption is a best caption for a specific meme 
  - request body content: caption id and name of the meme
  - response body content: isBestMatch boolean
  - response status codes and possible errors:
      - 500 failed to check best match
- POST `/api/best-captions`: purpose to check if a caption is a best caption for a specific meme 
  - request body content: meme and the list of the captions
  - response body content: array of best captions (should be of 2 elements)
  - response status codes and possible errors:
      - 500 failed to get best captions

## Database Tables

- Table `users` - contains all the infos about the registered users like username, name, surname and the crypted password
- Table `memes` - contains the meme image name used to retrieve the image from the public image folder, i need this because there could be a meme that still does not have best captions associated
- Table `captions` - contains the caption id and the caption description
- Table `answers` - is the table used to save the best captions
- Table `games` - saves the game id and the username of the player that played that game
- Table `rounds` - saves the round id, the game id, the username, the meme, the selected caption (could be empty), the round inside the game and the score that the user got in that round

## Screenshots

[![screenshot1](https://github.com/polito-WA1-2024-exam/exam-1-criicky/blob/main/img/screenshot1.png)](#)

[![screenshot2](https://github.com/polito-WA1-2024-exam/exam-1-criicky/blob/main/img/screenshot2.png)](#)


## Users Credentials

- criicky, pippoo (this one has some games played)
- prof, adminadmin 
