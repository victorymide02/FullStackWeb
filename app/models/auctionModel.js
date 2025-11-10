const dbModule = require('../models/database');

function getAll() {
    return new Promise((resolve, reject) => {
        dbModule.db.all('SELECT * FROM items', [], (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
}

function getById(id) {
    return new Promise((resolve, reject) => {
        dbModule.db.get('SELECT * FROM items WHERE item_id = ?', [id], (err, row) => {
            if (err) reject(err);
            else resolve(row);
        });
    });
}

function create(auction) {
    return new Promise((resolve, reject) => {
        const { name, description, starting_bid, start_date, end_date, creator_id } = auction;
        const query = `
            INSERT INTO items (name, description, starting_bid, start_date, end_date, creator_id)
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        dbModule.db.run(query, [name, description, starting_bid, start_date, end_date, creator_id], function (err) {
            if (err) reject(err);
            else resolve({ item_id: this.lastID, ...auction });
        });
    });
}

function update(id, auction) {
    return new Promise((resolve, reject) => {
        const { name, description, starting_bid, start_date, end_date } = auction;
        const query = `
            UPDATE items SET name = ?, description = ?, starting_bid = ?, start_date = ?, end_date = ?
            WHERE item_id = ?
        `;
        dbModule.db.run(query, [name, description, starting_bid, start_date, end_date, id], function (err) {
            if (err) reject(err);
            else resolve(this.changes ? { id, ...auction } : null);
        });
    });
}

function remove(id) {
    return new Promise((resolve, reject) => {
        const query = 'DELETE FROM items WHERE item_id = ?';
        dbModule.db.run(query, [id], function (err) {
            if (err) reject(err);
            else resolve(this.changes);
        });
    });
}

module.exports = { getAll, getById, create, update, remove };
