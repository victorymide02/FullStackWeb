import express from "express";
import * as controller from "../controllers/userController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", controller.register);
router.post("/login", controller.login);
router.post("/logout", authenticateToken, controller.logout);

// Example of a protected route
router.get("/profile", authenticateToken, (req, res) => {
    res.json({ 
        message: `Welcome user ${req.user.userId}` 
    });
});

export default router;
