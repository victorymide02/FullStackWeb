const express = require('express');
const router = express.Router();
const auctionController = require('../controllers/auctionController');
const { authenticateToken } = require('../middleware/authMiddleware');

// Define auction routes
router.post('/', authenticateToken, auctionController.createAuction);
router.get('/', auctionController.getAllAuctions);
router.get('/:id', auctionController.getAuctionById);
router.put('/:id', authenticateToken, auctionController.updateAuction);
router.delete('/:id', authenticateToken, auctionController.deleteAuction);

module.exports = router;
