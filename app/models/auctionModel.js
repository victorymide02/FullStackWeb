const { db } = require('../models/database');

// GET all auctions
async function getAllAuctions() {
    return new Promise((resolve, reject) => {
        const query = `SELECT * FROM items`;
        db.all(query, [], (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
}

// CREATE auction
async function createAuction(auction) {
    const { name, description, starting_bid, start_date, end_date, creator_id } = auction;

    return new Promise((resolve, reject) => {
        const query = `
            INSERT INTO items (name, description, starting_bid, start_date, end_date, creator_id)
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        db.run(
            query,
            [name, description, starting_bid, start_date, end_date, creator_id],
            function (err) {
                if (err) reject(err);
                else resolve({
                    item_id: this.lastID,
                    ...auction
                });
            }
        );
    });
}

// GET auction by ID
async function getAuctionById(id) {
    return new Promise((resolve, reject) => {
        const query = `SELECT * FROM items WHERE item_id = ?`;
        db.get(query, [id], (err, row) => {
            if (err) reject(err);
            else resolve(row);
        });
    });
}

// UPDATE auction
async function updateAuction(id, data) {
    const { name, description, starting_bid, start_date, end_date } = data;

    return new Promise((resolve, reject) => {
        const query = `
            UPDATE items
            SET name = ?, description = ?, starting_bid = ?, start_date = ?, end_date = ?
            WHERE item_id = ?
        `;
        db.run(
            query,
            [name, description, starting_bid, start_date, end_date, id],
            function (err) {
                if (err) reject(err);
                else resolve({ updated: this.changes });
            }
        );
    });
}

// DELETE auction
async function deleteAuction(id) {
    return new Promise((resolve, reject) => {
        const query = `DELETE FROM items WHERE item_id = ?`;
        db.run(query, [id], function (err) {
            if (err) reject(err);
            else resolve({ deleted: this.changes });
        });
    });
}

module.exports = {
    getAllAuctions,
    createAuction,
    getAuctionById,
    updateAuction,
    deleteAuction
};
