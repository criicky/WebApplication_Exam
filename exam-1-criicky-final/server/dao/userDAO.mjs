import crypto from "crypto";
import db from "../db/db.mjs";
import { resolve } from "path";

// NOTE: all functions return error messages as json object { error: <string> }
export default function UserDao() {

    this.registerUser = (username, name, surname, password) => {
      return new Promise((resolve, reject) => {
        console.log("registering user " + username + ' pass ' + password)
        const salt = crypto.randomBytes(16).toString('hex');
        crypto.scrypt(password, salt, 32, (err, hashedPassword) => {
          if (err) {
            console.error('Error hashing password:', err);
            return;
          }
      
          const user = {
            username,
            name,
            surname,
            salt,
            hash: hashedPassword.toString('hex'),
          };
      
          // Save the user to the database
          const sql = 'INSERT INTO users (username, name, surname, salt, hash) VALUES (?, ?, ?, ?, ?)';
          db.run(sql, [user.username, user.name, user.surname, user.salt, user.hash], (err) => {
            if (err) {
              console.error('Error saving user to database:', err);
              return reject(err);
            } else {
              console.log('User registered successfully');
              resolve({ username: user.username, name: user.name, surname: user.surname });
              return;
            }
          });
        });
      });
    }

    this.getUserByCredentials = (username, name, surname, password) => {
        return new Promise((resolve, reject) => {
            try{
                const sql = 'SELECT * FROM users WHERE username = ?';
                db.get(sql, [username], (err, row) => {
                    if (err) {
                        reject(err);
                    }
                    if (row === undefined) {
                        //registerUser(username, name, surname, password)
                        resolve(false);
                    }
                    else {
                        const user = { username: row.username, name: row.name, surname: row.surname};

                        // Check the hashes with an async call, this operation may be CPU-intensive (and we don't want to block the server)
                        crypto.scrypt(password, row.salt, 32, function (err, hashedPassword) { // WARN: it is 64 and not 32 (as in the week example) in the DB
                            if (err) reject(err);
                            if (!crypto.timingSafeEqual(Buffer.from(row.hash, 'hex'), hashedPassword)) // WARN: it is hash and not password (as in the week example) in the DB
                                resolve(false);
                            else
                                resolve(user);
                        });
                    }
                });
            }catch(err){
                console.log("error")
            }
        });
    }

    this.getUserByUsername = (username) => {
        return new Promise((resolve, reject) => {
            const sql = 'SELECT * FROM users WHERE username = ?';
            db.get(sql, [username], (err, row) => {
                console.log("PORCO DIO")
                if (err) {
                    reject(err);
                }
                if (row === undefined) {
                    resolve(false);
                } else {
                    const user = { username: row.username, name: row.name, surname: row.surname };
                    resolve(user);
                }
            });
        });
    }

}
