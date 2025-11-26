const auctionModel = require('../models/auctionModel');
const Joi = require('joi');

// Joi schema for auction validation
const auctionSchema = Joi.object({
    name: Joi.string().min(3).max(100).required(),
    description: Joi.string().max(500).optional(),
    starting_bid: Joi.number().positive().required(),
    start_date: Joi.number().required(), // timestamp
    end_date: Joi.number().required(),   // timestamp
});

// CREATE auction
async function createAuction(req, res) {
    try {
        console.log('REQ BODY:', req.body);
        console.log('REQ USER:', req.user); //temporary debug (delete later)

        const { error, value } = auctionSchema.validate(req.body);
        if (error) return res.status(400).json({ message: error.details[0].message });

        //add creator_id from authenticated user
        const auctionData = { ...value, creator_id: req.user.user_id };

        const newAuction = await auctionModel.createAuction(auctionData);
        res.status(201).json(newAuction);
    } catch (err) {
        console.error('CREATE ERROR:', err);
        res.status(500).json({ message: 'Error creating auction' });
    }
}

// GET all auctions
async function getAllAuctions(req, res) {
    try {
        const auctions = await auctionModel.getAllAuctions();
        res.json(auctions);
    } catch (err) {
        console.error('GET ALL ERROR:', err);
        res.status(500).json({ message: 'Error fetching auctions' });
    }
}

// GET auction by ID
async function getAuctionById(req, res) {
    try {
        const id = parseInt(req.params.id);
        const auction = await auctionModel.getAuctionById(id);
        if (!auction) return res.status(404).json({ message: 'Auction not found' });
        res.json(auction);
    } catch (err) {
        console.error('GET ONE ERROR:', err);
        res.status(500).json({ message: 'Error fetching auction' });
    }
}

// UPDATE auction
async function updateAuction(req, res) {
    try {
        console.log('REQ BODY:', req.body);

        const id = parseInt(req.params.id);
        const { error, value } = auctionSchema.validate(req.body);
        if (error) return res.status(400).json({ message: error.details[0].message });

        const updated = await auctionModel.updateAuction(id, value);
        res.json({ message: 'Auction updated', ...updated });
    } catch (err) {
        console.error('UPDATE ERROR:', err);
        res.status(500).json({ message: 'Error updating auction' });
    }
}

// DELETE auction
async function deleteAuction(req, res) {
    try {
        const id = parseInt(req.params.id);
        const result = await auctionModel.deleteAuction(id);
        if (result.deleted === 0) return res.status(404).json({ message: 'Auction not found' });
        res.json({ message: 'Auction deleted' });
    } catch (err) {
        console.error('DELETE ERROR:', err);
        res.status(500).json({ message: 'Error deleting auction' });
    }
}

module.exports = {
    createAuction,
    getAllAuctions,
    getAuctionById,
    updateAuction,
    deleteAuction,
};
