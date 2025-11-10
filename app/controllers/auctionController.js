const auctionModel = require('../models/auctionModel');
const { auctionSchema } = require('../validation/auctionValidation');

async function getAllAuctions(req, res, next) {
    try {
        const auctions = await auctionModel.getAll();
        res.json(auctions);
    } catch (err) {
        next(err);
    }
}

async function getAuctionById(req, res, next) {
    try {
        const auction = await auctionModel.getById(req.params.id);
        if (!auction) return res.status(404).json({ message: 'Auction not found' });
        res.json(auction);
    } catch (err) {
        next(err);
    }
}

async function createAuction(req, res, next) {
    try {
        const { error, value } = auctionSchema.validate(req.body);
        if (error) return res.status(400).json({ message: error.details[0].message });

        const newAuction = await auctionModel.create(value);
        res.status(201).json(newAuction);
    } catch (err) {
        next(err);
    }
}

async function updateAuction(req, res, next) {
    try {
        const { error, value } = auctionSchema.validate(req.body);
        if (error) return res.status(400).json({ message: error.details[0].message });

        const updated = await auctionModel.update(req.params.id, value);
        if (!updated) return res.status(404).json({ message: 'Auction not found' });
        res.json({ message: 'Auction updated', auction: updated });
    } catch (err) {
        next(err);
    }
}

async function deleteAuction(req, res, next) {
    try {
        const deleted = await auctionModel.remove(req.params.id);
        if (!deleted) return res.status(404).json({ message: 'Auction not found' });
        res.json({ message: 'Auction deleted' });
    } catch (err) {
        next(err);
    }
}

module.exports = {
    getAllAuctions,
    getAuctionById,
    createAuction,
    updateAuction,
    deleteAuction,
};