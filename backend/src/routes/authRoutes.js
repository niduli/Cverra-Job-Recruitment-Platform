// // backend/src/routes/authRoutes.js
// const express = require('express');
// const router = express.Router();
// const authController = require('../controllers/authController');

// // POST /api/auth/register
// router.post('/register', authController.register);

// // POST /api/auth/login
// router.post('/login', authController.login);

// module.exports = router;


import express from "express";
import * as authController from "../controllers/authController.js";

const router = express.Router();

// routes
router.post("/register", authController.register);
router.post("/login", authController.login);

export default router;
