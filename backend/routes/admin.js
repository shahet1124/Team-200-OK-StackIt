const express = require('express');
const { authenticateUser, requireAdmin } = require('../lib/auth');
const {
  getStats,
  getAllUsers,
  banUser,
  changeUserRole,
  deleteQuestion,
  deleteAnswer,
  sendAnnouncement,
  getRecentActivity
} = require('../controllers/adminController');
const router = express.Router();

// Get platform statistics
router.get('/stats', authenticateUser, requireAdmin, getStats);

// Get all users (admin only)
router.get('/users', authenticateUser, requireAdmin, getAllUsers);

// Ban/Unban user
router.put('/users/:id/ban', authenticateUser, requireAdmin, banUser);

// Change user role
router.put('/users/:id/role', authenticateUser, requireAdmin, changeUserRole);

// Delete question (admin only)
router.delete('/questions/:id', authenticateUser, requireAdmin, deleteQuestion);

// Delete answer (admin only)
router.delete('/answers/:id', authenticateUser, requireAdmin, deleteAnswer);

// Send platform-wide notification
router.post('/announcements', authenticateUser, requireAdmin, sendAnnouncement);

// Get recent activity
router.get('/activity', authenticateUser, requireAdmin, getRecentActivity);

module.exports = router; 