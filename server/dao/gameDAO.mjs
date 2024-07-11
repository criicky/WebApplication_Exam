import db from "../db/db.mjs";

export function roundOfGame (round, meme, caption, score){
    this.round = round;
    this.meme = meme;
    this.caption = caption;
    this.score = score;
}

export function Game (gameID, totscore, rounds){
    this.gameID = gameID;
    this.totscore = totscore;
    this.rounds = rounds;
}

// NOTE: all functions return error messages as json object { error: <string> }
export default function GameDAO() {

    // This function retrieves one user by id
    this.createGame = (username) => {
        return new Promise((resolve, reject) => {
                const query = 'INSERT INTO games(username) VALUES(?)';
                db.run(query, [username],  function(err){ //i use function beacuse i need to access lastID
                    if (err) {
                        reject(err);
                    }
                    const gameId = this.lastID; // Access lastID from the callback function's context
                    resolve(gameId);
                });
        });
    }

    this.getGameById = (id) => {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM games WHERE id=?';
            db.get(query, [id], (err, row) => {
                if (err) {
                    reject(err);
                }
                if (row === undefined) {
                    resolve({error: 'Game not found.'});
                } else {
                    resolve(row);
                }
            });
        });
    };

    this.getUserGames = (username) => {
        return new Promise((resolve, reject) => {
            const query = 'SELECT g.gameID, SUM(score) as totscore FROM games as g, rounds WHERE g.gameID = rounds.gameID AND g.username = ? GROUP BY g.gameID ORDER BY g.gameID ASC';
            db.all(query, [username], (err, rows) => {
                if (err) {
                    reject(err);
                }
                if (rows === undefined) {
                    resolve([]);
                    return;
                }
                const query2 = 'SELECT * FROM rounds WHERE gameID = ?';
                const games = [];
                const gamesPromises = rows.map(row => new Promise((resolve, reject) => {
                    db.all(query2, [row.gameID], (err, rounds) => {
                        if (err) {
                            reject(err);
                        }
                        const rnds = rounds.map((round) => new roundOfGame(round.roundOfGame, round.meme, round.caption, round.score));
                        games.push(new Game(row.gameID, row.totscore, rounds));
                        resolve(games);
                    });
                }))
                Promise.all(gamesPromises).then(() => resolve(games));
            });
        });
    };

    this.saveRound = (gameID, username, meme, caption, roundNumber, score) => {
        return new Promise((resolve, reject) => {
            try{
                const sql = 'SELECT * FROM games WHERE gameID = ? AND username = ?';
                db.get(sql, [gameID, username], (err, row) => {
                    if (err) {
                        reject(err);
                    }
                    if (row === undefined) {
                        reject({error: 'Game not found.'});
                    }
                    const query = 'INSERT INTO rounds(gameID, username, meme, caption, roundOfGame, score) VALUES(?, ?, ?, ?, ?, ?)';
                    db.run(query, [gameID, username, meme, caption, roundNumber, score],  (err) => {
                        if (err) {
                            reject(err);
                        }
                        resolve();
                    });
                });
            }catch(err){
                reject(err);
            }
        });
    }

    this.getUserTotalScore = (username) => {
        return new Promise((resolve, reject) => {
            const query = 'SELECT SUM(score) as totalScore FROM rounds WHERE username = ? GROUP BY username';
            db.get(query, [username], (err, row) => {
                if (err) {
                    reject(err);
                }
                if (row === undefined) {
                    resolve(0);
                } else {
                    const totalScore = row.totalScore;
                    resolve(totalScore);
                }
            });
        });
    }

}
