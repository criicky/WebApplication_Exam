import db from '../db/db.mjs';
import { Meme } from '../components/meme.mjs';

export function Caption (id, text){
    this.id = id;
    this.text = text;
}

export default function MemeDAO() {

    this.getAllMemes = () => {
        return new Promise(async(resolve, reject) => {
            try {
                const sql = 'SELECT m.imageName FROM memes as m WHERE m.imageName IN (SELECT a.meme FROM answers as a)';
                db.all(sql, (err, memes) => {
                    if (err) {
                        throw new Error('Failed to retrieve memes from the database');
                    }
                    const memeNames = memes.map(meme => new Meme(meme.imageName));
                    return resolve(memeNames);
                });
            } catch (error) {
                throw new Error('Failed connection to the database');
            }
        })
    };

    this.getRandomMeme = (pastMemes) => {
        return new Promise(async (resolve, reject) => {
            try {
                const memes = await this.getAllMemes();
                for (const meme of pastMemes) {
                    const index = memes.findIndex(m => m.memeName === meme);
                    if (index !== -1) {
                        memes.splice(index, 1);
                    }
                }
                const randomIndex = Math.floor(Math.random() * memes.length);   //generate a random index
                const randomMeme = memes[randomIndex].memeName;  //get the meme at the random index
                return resolve(randomMeme);  //return the random meme
            } catch (error) {
                throw new Error('Failed to retrieve a random meme from the database');
            }
        });
    };

    this.getCaptionsForMeme = (memeName) => {
        return new Promise(async(resolve, reject) => {
            // First SQL query to get caption IDs
            const sql1 = 'SELECT captionID FROM answers WHERE meme = ? ORDER BY RANDOM() LIMIT 2';
            db.all(sql1, [memeName], (err, captionIDs) => {
                if (err) {
                    console.error('Error retrieving caption IDs:', err);
                    return reject(new Error('Failed to retrieve captions for the meme from the database'));
                }
    
                if (!captionIDs || captionIDs.length === 0) {
                    return reject(new Error('No caption IDs found for the meme'));
                }
    
                // Prepare IDs for the IN clause
                const ids = captionIDs.map(id => id.captionID).join(',');
                if (ids.length === 0) {
                    return reject(new Error('No valid caption IDs found'));
                }
    
                // Second SQL query to get captions based on the retrieved IDs
                const sql2 = `SELECT captionID, captionDesc FROM captions WHERE captionID IN (${ids})`;
                db.all(sql2, [], (err, captions) => {
                    if (err) {
                        console.error('Error retrieving captions:', err);
                        return reject(new Error('Failed to retrieve captions for the meme from the database'));
                    }
    
                    if (!captions || captions.length === 0) {
                        return reject(new Error('No captions found for the given IDs'));
                    }
    
                    // Map the results to Caption objects (assuming Caption is a valid class)
                    const captionObjects = captions.map(caption => new Caption(caption.captionID, caption.captionDesc));
    
                    // Resolve the promise with the retrieved captions
                    return resolve(captionObjects);
                });
            });
        });
    };

    this.checkBestMatch = (memeName, captionID) => {
        return new Promise(async(resolve, reject) => {
            // SQL query to check if the caption is the best match for the meme
            const sql = 'SELECT * FROM answers WHERE meme = ? AND captionID = ?';
            db.get(sql, [memeName, captionID], (err, result) => {
                if (err) {
                    console.error('Error checking best match:', err);
                    return resolve(false);
                }
                if(!result){
                    return resolve(false);
                }
                return resolve(true);
            });
        });
    }

    this.getNonMatchingCaptions = (memeName, bestCaptions) => {
        return new Promise(async(resolve, reject) => {
            // SQL query to get non-matching caption IDs
            const sql1 = `
                SELECT captions.captionID 
                FROM captions 
                LEFT JOIN answers ON captions.captionID = answers.captionID AND answers.meme != ?
                WHERE captions.captionID NOT IN (
                    SELECT captionID FROM answers WHERE meme = ?
                )
            `;
            
            db.all(sql1, [memeName, memeName], (err, captionIDs) => {
    
                if (err) {
                    console.error('Error retrieving non-matching caption IDs:', err);
                    return reject(new Error('Failed to retrieve non-matching caption IDs from the database'));
                }
    
                if (!captionIDs || captionIDs.length === 0) {
                    return reject(new Error('No non-matching caption IDs found for the meme'));
                }
    
                // Prepare IDs for the IN clause
                const ids = captionIDs.map(id => id.captionID).join(',');
                if (ids.length === 0) {
                    return reject(new Error('No valid caption IDs found'));
                }
    
                // SQL query to get caption descriptions
                const sql2 = `SELECT captionID, captionDesc FROM captions WHERE captionID IN (${ids}) ORDER BY RANDOM() LIMIT 5`;
    
                db.all(sql2, [], (err, captions) => {
                    if (err) {
                        console.error('Error retrieving captions:', err);
                        return reject(new Error('Failed to retrieve captions from the database'));
                    }
    
                    if (!captions || captions.length === 0) {
                        return reject(new Error('No captions found for the given IDs'));
                    }
    
                    // Map the results to Caption objects
                    const captionObjects = captions.map(caption => new Caption(caption.captionID, caption.captionDesc));
                    // Resolve the promise with the retrieved captions
                    return resolve(captionObjects);
                });
            });
        });
    };

    this.getBestCaptions = (memeName, captions) => {
        return new Promise(async(resolve, reject) => {
            
            const finalCaptions = [];

            for(const caption of captions){
                if(await this.checkBestMatch(memeName, caption.id)){
                    finalCaptions.push(caption);
                }
            }

            return resolve(finalCaptions);
        });
    }

};