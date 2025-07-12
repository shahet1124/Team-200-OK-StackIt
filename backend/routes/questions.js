const express = require('express');
const { authenticateUser, requireAuth } = require('../lib/auth');
const {
  getAllQuestions,
  getQuestionById,
  createQuestion,
  updateQuestion,
  acceptAnswer,
  searchByTags
} = require('../controllers/questionController');
const router = express.Router();

// Get all questions with pagination
router.get('/', getAllQuestions);

// Get question by ID with answers
router.get('/:id', getQuestionById);

// Ask a new question
router.post('/', authenticateUser, requireAuth, createQuestion);

// Update question (only by owner)
router.put('/:id', authenticateUser, requireAuth, updateQuestion);

// Accept an answer (only by question owner)
router.post('/:id/accept-answer/:answerId', authenticateUser, requireAuth, acceptAnswer);

// Search questions by tags
router.get('/search/tags', searchByTags);

module.exports = router; 