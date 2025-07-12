const express = require('express');
const { authenticateUser, requireAuth } = require('../lib/auth');
const {
  createAnswer,
  updateAnswer,
  voteAnswer,
  getVotes,
  deleteAnswer
} = require('../controllers/answerController');
const router = express.Router();

// Post an answer
router.post('/', authenticateUser, requireAuth, createAnswer);

// Update answer (only by owner)
router.put('/:id', authenticateUser, requireAuth, updateAnswer);

// Vote on an answer
router.post('/:id/vote', authenticateUser, requireAuth, voteAnswer);

// Get votes for an answer
router.get('/:id/votes', getVotes);

// Delete answer (only by owner or admin)
router.delete('/:id', authenticateUser, requireAuth, deleteAnswer);

module.exports = router; 