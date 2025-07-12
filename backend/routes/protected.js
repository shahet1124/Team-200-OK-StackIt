const express = require('express');
const { authenticateUser, isAuthenticated } = require('../lib/auth');
const router = express.Router();

router.post('/edit_blog', authenticateUser, isAuthenticated('editBlog'), (req, res) => {
  // ...edit blog logic
  res.json({ message: 'Blog edited' });
});

router.get('/dashboard', authenticateUser, isAuthenticated('viewDashboard'), (req, res) => {
  // ...dashboard logic
  res.json({ message: 'Dashboard data' });
});

module.exports = router; 