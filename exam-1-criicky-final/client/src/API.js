const SERVER_URL = 'http://localhost:3001/api';

const logIn = async (credentials) => {
    return await fetch(SERVER_URL + '/sessions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',  // this parameter specifies that authentication cookie must be forwared. It is included in all the authenticated APIs.
        body: JSON.stringify(credentials),
    }).then(handleInvalidResponse)
    .then(response => response.json());
};

const register = async (credentials) => {
    return await fetch(SERVER_URL + '/sessions/registration', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(credentials),
    }).then(handleInvalidResponse)
    .then(response => response.json());
};
  
/**
 * This function is used to verify if the user is still logged-in.
 * It returns a JSON object with the user info.
 */
const getUserInfo = async () => {
    return await fetch(SERVER_URL + '/sessions/current', {
        credentials: 'include'
    }).then(handleInvalidResponse)
    .then(response => response.json());
};

const getUserGames = async (username) => {
    return await fetch(`${SERVER_URL}/users/${username}/games`, { credentials: 'include' }).then(handleInvalidResponse)
    .then(response => response.json());
}

const getUserTotalScore = async (username) => {
    try{
        const response = await fetch(SERVER_URL + '/total-score', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({ username: username }),
        })

        if (!response.ok) {
            throw new Error('Failed to create game');
        }

        const data = await response.json();
        return data;
    }
    catch (error) {
        console.error('Error in getting the total score:', error);
        throw error;
    }
}
  
  /**
   * This function destroy the current user's session (executing the log-out).
   */
const logOut = async() => {
    return await fetch(SERVER_URL + '/sessions/current', {
      method: 'DELETE',
      credentials: 'include'
    }).then(handleInvalidResponse);
  }

async function getMemeWithCaptions(pastMemes) {
    try {
        const response = await fetch(SERVER_URL + '/meme-with-captions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ pastMemes })
        });
        await handleInvalidResponse(response);
        return await response.json();
    } catch (error) {
        console.error('Error fetching meme and captions:', error);
        throw error;  // Re-throw the error to handle it in the calling function
    }
}

async function handleInvalidResponse(response) {
    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}, ${response.statusText}`);
    }

    const contentType = response.headers.get('Content-Type');
    if (contentType && contentType.indexOf('application/json') === -1) {
        throw new TypeError(`Expected JSON, got ${contentType}`);
    }

    return response;
}

async function saveGame(username) {
    try {
        const response = await fetch(SERVER_URL + '/home', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({ userEmail: username }),
        });

        if (!response.ok) {
            throw new Error('Failed to create game');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error in createGame:', error);
        throw error;
    }
}



async function createGame(username) {
    try {
        const response = await fetch(SERVER_URL + '/create-game', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials : 'include',
            body: JSON.stringify({ username: username }),
        });

        if (!response.ok) {
            throw new Error('Failed to create game');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error in createGame:', error);
        throw error;
    }
}

async function saveRound(gameID, username, meme, caption, roundNumber, score) {
    return await fetch(SERVER_URL + '/save-round', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({  // Wrap your data in an object here
            gameID: gameID,
            username: username,
            meme: meme,
            caption: caption,
            roundNumber: roundNumber,
            score: score
        }),
    }).then(handleInvalidResponse)
}

async function checkBestMatch(meme, captionID) {
    try{
        const response = await fetch(SERVER_URL + '/check-best-match', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ meme: meme, captionID: captionID }),
        })

        if (!response.ok) {
            throw new Error('Failed to create game');
        }

        const data = await response.json();
        return data;
    }
    catch (error) {
        console.error('Error in createGame:', error);
        throw error;
    }
}

async function getBestCaptions(meme,captions){

    try{
        const response = await fetch(SERVER_URL + '/best-captions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ meme: meme, captions: captions }),
        })

        if (!response.ok) {
            throw new Error('Failed to create game');
        }

        const data = await response.json();
        return data;
    }
    catch (error) {
        console.error('Error in finding the best captions', error);
        throw error;
    }

}

const API = {logIn, getUserInfo, logOut, getMemeWithCaptions, createGame, register, getUserGames, saveGame, saveRound, checkBestMatch, getUserTotalScore, getBestCaptions };
export default API;