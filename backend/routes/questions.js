const express = require('express');
const router = express.Router();
const Question = require('../models/question');

// Get all questions
router.get('/', async (req, res) => {
  try {
    const questions = await Question.find().sort({ createdAt: -1 });
    res.json(questions);
  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).json({ message: 'Failed to fetch questions' });
  }
});

// Create a new question
router.post('/', async (req, res) => {
  try {
    // Validate required fields
    const { type, title, category } = req.body;
    if (!type || !title || !category) {
      return res.status(400).json({ 
        message: 'Missing required fields: type, title, and category are required' 
      });
    }

    // Create and save the question
    const question = new Question(req.body);
    const savedQuestion = await question.save();
    res.status(201).json(savedQuestion);
  } catch (error) {
    console.error('Error creating question:', error);
    res.status(400).json({ 
      message: 'Failed to create question',
      error: error.message 
    });
  }
});

// Update a question
router.put('/:id', async (req, res) => {
  try {
    const updatedQuestion = await Question.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedQuestion) {
      return res.status(404).json({ message: 'Question not found' });
    }

    res.json(updatedQuestion);
  } catch (error) {
    console.error('Error updating question:', error);
    res.status(400).json({ 
      message: 'Failed to update question',
      error: error.message 
    });
  }
});

// Delete a question
router.delete('/:id', async (req, res) => {
  try {
    const deletedQuestion = await Question.findByIdAndDelete(req.params.id);
    
    if (!deletedQuestion) {
      return res.status(404).json({ message: 'Question not found' });
    }

    res.json({ message: 'Question deleted successfully' });
  } catch (error) {
    console.error('Error deleting question:', error);
    res.status(500).json({ 
      message: 'Failed to delete question',
      error: error.message 
    });
  }
});

module.exports = router;

