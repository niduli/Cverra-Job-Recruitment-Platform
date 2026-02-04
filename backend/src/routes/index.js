// // backend/src/routes/index.js
// const express = require('express');
// const router = express.Router();

// // small test route
// router.get('/', (req, res) => res.json({ message: 'API root' }));

// // you will later replace with: router.use('/auth', require('./authRoutes'));
// module.exports = router;


import express from "express";

const router = express.Router();

// Base API route
router.get("/", (req, res) => {
  res.json({ message: "API is running" });
});

export default router;
