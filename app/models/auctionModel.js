const database = require('../models/database');

// GET all auctions
function getAllAuctions() {
    const db = database.db; // dynamically access the live DB
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM items';
        db.all(sql, [], (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
}

// GET auction by ID
function getAuctionById(id) {
    const db = database.db;
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM items WHERE item_id = ?';
        db.get(sql, [id], (err, row) => {
            if (err) reject(err);
            else resolve(row);
        });
    });
}

// CREATE auction
function createAuction(auction) {
    const db = database.db;
    const { name, description, starting_bid, start_date, end_date, creator_id } = auction;
    return new Promise((resolve, reject) => {
        const sql = `
            INSERT INTO items (name, description, starting_bid, start_date, end_date, creator_id)
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        db.run(sql, [name, description, starting_bid, start_date, end_date, creator_id], function (err) {
            if (err) reject(err);
            else resolve({ item_id: this.lastID, ...auction });
        });
    });
}

function updateAuction(id, updatedAuction) {
    const db = database.db;
    const { name, description, starting_bid, start_date, end_date } = updatedAuction;
    return new Promise((resolve, reject) => {
        const sql = `
            UPDATE items
            SET name = ?, description = ?, starting_bid = ?, start_date = ?, end_date = ?
            WHERE item_id = ?
        `;
        db.run(sql, [name, description, starting_bid, start_date, end_date, id], function (err) {
            if (err) reject(err);
            else resolve({ changes: this.changes });
        });
    });
}

function deleteAuction(id) {
    const db = database.db;
    return new Promise((resolve, reject) => {
        const sql = 'DELETE FROM items WHERE item_id = ?';
        db.run(sql, [id], function (err) {
            if (err) reject(err);
            else resolve({ deleted: this.changes });
        });
    });
}

module.exports = {
    getAllAuctions,
    getAuctionById,
    createAuction,
    updateAuction,
    deleteAuction,
};
