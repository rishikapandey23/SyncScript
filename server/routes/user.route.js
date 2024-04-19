const express = require('express');
const { signupUser, loginUser, getUserById } = require('../controllers/user.controller');
const authenticateToken = require('../middleware/user.middleware');
const router = express.Router();

router.post("/signup", signupUser)

router.post("/login", [authenticateToken], loginUser)

router.get("/user_data/:id", [authenticateToken], getUserById)

module.exports = router;
