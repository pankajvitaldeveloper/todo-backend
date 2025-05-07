const express = require("express");
const router = express.Router();
const {register, login} = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/register", register);
router.post("/login", login);

// protected route
router.get("/protected", authMiddleware, (req, res) => {    
    res.json({message: "Protected route", userId: req.userId});//req.userId is set by authMiddleware
});

module.exports = router;
