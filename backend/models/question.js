const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['fillInBlanks', 'comprehension', 'mcq']
  },
  title: {
    type: String,
    required: true,
    default: 'New Question'
  },
  category: {
    type: String,
    required: true,
    default: 'general'
  },
  content: {
    type: String,
    default: ''
  },
  answers: {
    type: [String],
    default: ['', '', '', '']
  },
  correctAnswer: {
    type: String,
    default: '0'
  },
  points: {
    type: Number,
    default: 1
  },
  paragraph: {
    type: String,
    default: ''
  }
}, {
  timestamps: true,
  strict: false
});

module.exports = mongoose.model('Question', QuestionSchema);
