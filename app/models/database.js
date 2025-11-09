const sqlite3 = require('sqlite3').verbose();
const DBSOURCE = 'db.sqlite';

let db;

function initDB() {
    db = new sqlite3.Database(DBSOURCE, (err) => {
        if (err) {
            console.error(err.message);
            throw err;
        } else {
            console.log('Connected to the SQLite database.');

            db.run(`CREATE TABLE IF NOT EXISTS users (
                user_id INTEGER PRIMARY KEY AUTOINCREMENT,
                first_name TEXT,
                last_name TEXT,
                email TEXT UNIQUE,
                password TEXT,
                salt TEXT,
                session_token TEXT
            )`);

            db.run(`CREATE TABLE IF NOT EXISTS items (
                item_id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT,
                description TEXT,
                starting_bid INTEGER,
                start_date INTEGER,
                end_date INTEGER,
                creator_id INTEGER,
                FOREIGN KEY(creator_id) REFERENCES users(user_id)
            )`);

            db.run(`CREATE TABLE IF NOT EXISTS bids (
                item_id INTEGER,
                user_id INTEGER,
                amount INTEGER,
                timestamp INTEGER,
                PRIMARY KEY (item_id, user_id, amount),
                FOREIGN KEY (item_id) REFERENCES items(item_id),
                FOREIGN KEY (user_id) REFERENCES users(user_id)
            )`);

            db.run(`CREATE TABLE IF NOT EXISTS questions (
                question_id INTEGER PRIMARY KEY AUTOINCREMENT,
                question TEXT,
                answer TEXT,
                asked_by INTEGER,
                item_id INTEGER,
                FOREIGN KEY (asked_by) REFERENCES users(user_id),
                FOREIGN KEY (item_id) REFERENCES items(item_id)
            )`);
        }
    });

    return db;
}

module.exports = { initDB, db };
