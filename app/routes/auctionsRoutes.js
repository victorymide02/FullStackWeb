import express from "express";
import * as controller from "controllers/auctionController.js";

const router = express.Router();

router.get("/", controller.getAllAuctions);
router.post("/", controller.createAuction);
router.get("/:id", controller.getAuctionById);
router.patch("/:id", controller.updateAuction);
router.delete("/:id", controller.deleteAuction);

export default router;
