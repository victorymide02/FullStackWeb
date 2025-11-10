const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticateToken } = require('../middleware/authMiddleware');

router.post('/register', userController.register);
router.post('/login', userController.login);
router.post('/logout', authenticateToken, userController.logout);
router.get('/profile', authenticateToken, userController.getProfile);

module.exports = router;