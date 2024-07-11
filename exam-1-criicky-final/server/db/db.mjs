/** DB access module **/

import sqlite3 from 'sqlite3';

// Opening the database
// NOTE: to work properly you must run the server inside "server" folder (i.e., ./solution/server)
const database_path = './server/db/';
const db = new sqlite3.Database('./db/game.db', (err) => {
    if (err) throw err;
});

export default db;
