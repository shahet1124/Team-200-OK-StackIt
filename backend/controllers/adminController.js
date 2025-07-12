const User = require('../models/User');
const Question = require('../models/Question');
const Answer = require('../models/Answer');
const Notification = require('../models/Notification');
const Vote = require('../models/Vote');

const getStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalQuestions = await Question.countDocuments();
    const totalAnswers = await Answer.countDocuments();
    const bannedUsers = await User.countDocuments({ isBanned: true });
    const questionsThisWeek = await Question.countDocuments({
      createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
    });
    
    res.json({
      totalUsers,
      totalQuestions,
      totalAnswers,
      bannedUsers,
      questionsThisWeek
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    
    const users = await User.find()
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    const total = await User.countDocuments();
    
    res.json({
      users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
};

const banUser = async (req, res) => {
  try {
    const { isBanned } = req.body;
    
    if (typeof isBanned !== 'boolean') {
      return res.status(400).json({ error: 'isBanned must be a boolean' });
    }
    
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Prevent admin from banning themselves
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ error: 'Cannot ban yourself' });
    }
    
    user.isBanned = isBanned;
    await user.save();
    
    res.json({ 
      message: `User ${isBanned ? 'banned' : 'unbanned'} successfully`,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        isBanned: user.isBanned
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update user ban status' });
  }
};

const changeUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    
    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ error: 'Role must be "user" or "admin"' });
    }
    
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Prevent admin from changing their own role
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ error: 'Cannot change your own role' });
    }
    
    user.role = role;
    await user.save();
    
    res.json({ 
      message: 'User role updated successfully',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        isBanned: user.isBanned
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update user role' });
  }
};

const deleteQuestion = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    if (!question) {
      return res.status(404).json({ error: 'Question not found' });
    }
    
    // Delete all answers for this question
    await Answer.deleteMany({ questionId: req.params.id });
    
    // Delete all votes for answers of this question
    const answers = await Answer.find({ questionId: req.params.id });
    const answerIds = answers.map(answer => answer._id);
    await Vote.deleteMany({ answerId: { $in: answerIds } });
    
    // Delete the question
    await Question.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'Question and all related content deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete question' });
  }
};

const deleteAnswer = async (req, res) => {
  try {
    const answer = await Answer.findById(req.params.id);
    if (!answer) {
      return res.status(404).json({ error: 'Answer not found' });
    }
    
    // Remove all votes for this answer
    await Vote.deleteMany({ answerId: req.params.id });
    
    // Remove answer from accepted answer if it was accepted
    await Question.updateMany(
      { acceptedAnswerId: req.params.id },
      { $unset: { acceptedAnswerId: 1 } }
    );
    
    await Answer.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'Answer deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete answer' });
  }
};

const sendAnnouncement = async (req, res) => {
  try {
    const { message, link } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }
    
    // Get all users
    const users = await User.find({ isBanned: false });
    
    // Create notifications for all users
    const notifications = users.map(user => ({
      userId: user._id,
      type: 'mention',
      message: `[ANNOUNCEMENT] ${message}`,
      link: link || null
    }));
    
    await Notification.insertMany(notifications);
    
    res.json({ 
      message: 'Announcement sent successfully',
      recipients: users.length
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to send announcement' });
  }
};

const getRecentActivity = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;
    
    const recentQuestions = await Question.find()
      .populate('userId', 'username')
      .sort({ createdAt: -1 })
      .limit(limit);
    
    const recentAnswers = await Answer.find()
      .populate('userId', 'username')
      .populate('questionId', 'title')
      .sort({ createdAt: -1 })
      .limit(limit);
    
    const recentUsers = await User.find()
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(limit);
    
    res.json({
      recentQuestions,
      recentAnswers,
      recentUsers
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch activity' });
  }
};

module.exports = {
  getStats,
  getAllUsers,
  banUser,
  changeUserRole,
  deleteQuestion,
  deleteAnswer,
  sendAnnouncement,
  getRecentActivity
}; 