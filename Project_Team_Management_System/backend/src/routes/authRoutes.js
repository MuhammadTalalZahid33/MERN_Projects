import express from "express";
import { registerUser, loginUser } from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// GET
router.get("/me", protect, (req, res) => {
  res.json(req.user);
});


// POST
router.post("/register", registerUser);
router.post("/login", loginUser);

export default router;
