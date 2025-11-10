const database = require('../models/database');  // ⬅️ Keep the module reference
const crypto = require('crypto');

// Helper: generate salt and hash
function generateHash(password, salt) {
    return crypto.createHmac('sha512', salt).update(password).digest('hex');
}

async function findUserByEmail(email) {
    const db = database.db; // ⬅️ Access live getter *now*
    return new Promise((resolve, reject) => {
        const query = 'SELECT * FROM users WHERE email = ?';
        db.get(query, [email], (err, row) => {
            if (err) reject(err);
            else resolve(row);
        });
    });
}

async function createUser(first_name, last_name, email, password) {
    const db = database.db; // ⬅️ same here
    const salt = crypto.randomBytes(16).toString('hex');
    const passwordHash = generateHash(password, salt);
    const query = `
        INSERT INTO users (first_name, last_name, email, password, salt)
        VALUES (?, ?, ?, ?, ?)
    `;

    return new Promise((resolve, reject) => {
        db.run(query, [first_name, last_name, email, passwordHash, salt], function (err) {
            if (err) reject(err);
            else resolve({ user_id: this.lastID, email });
        });
    });
}

async function updateSessionToken(user_id, token) {
    const db = database.db; // ⬅️ and here
    return new Promise((resolve, reject) => {
        const query = 'UPDATE users SET session_token = ? WHERE user_id = ?';
        db.run(query, [token, user_id], function (err) {
            if (err) reject(err);
            else resolve();
        });
    });
}

module.exports = { findUserByEmail, createUser, updateSessionToken, generateHash };
