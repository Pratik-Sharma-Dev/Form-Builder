const express = require('express');
const router = express.Router();
const Response = require('../models/response.js');

// Save a new response
router.post('/', async (req, res) => {
  const response = new Response(req.body);
  try {
    const newResponse = await response.save();
    res.status(201).json(newResponse);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all responses for a specific question
router.get('/question/:questionId', async (req, res) => {
  try {
    const responses = await Response.find({ questionId: req.params.questionId });
    res.json(responses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

