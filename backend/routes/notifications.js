const express = require('express');
const { authenticateUser, requireAuth } = require('../lib/auth');
const {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  getUnreadCount
} = require('../controllers/notificationController');
const router = express.Router();

// Get user's notifications
router.get('/', authenticateUser, requireAuth, getNotifications);

// Mark notification as read
router.put('/:id/read', authenticateUser, requireAuth, markAsRead);

// Mark all notifications as read
router.put('/read-all', authenticateUser, requireAuth, markAllAsRead);

// Delete a notification
router.delete('/:id', authenticateUser, requireAuth, deleteNotification);

// Get unread count
router.get('/unread-count', authenticateUser, requireAuth, getUnreadCount);

module.exports = router; 