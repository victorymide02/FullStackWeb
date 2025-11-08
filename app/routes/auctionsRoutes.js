import express from "express";
import * as controller from "controllers/auctionController.js";

// app/routes/userRoutes.js
const express = require('express');
const userController = require('./app/controllers/userController');

// Example route
router.post('/register', userController.register);

module.exports = router;

const router = express.Router();

router.get("/", controller.getAllAuctions);
router.post("/", controller.createAuction);
router.get("/:id", controller.getAuctionById);
router.patch("/:id", controller.updateAuction);
router.delete("/:id", controller.deleteAuction);

export default router;
