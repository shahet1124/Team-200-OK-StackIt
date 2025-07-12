const Answer = require('../models/Answer');
const Question = require('../models/Question');
const Vote = require('../models/Vote');
const Notification = require('../models/Notification');

const createAnswer = async (req, res) => {
  try {
    const { questionId, content } = req.body;
    
    if (!questionId || !content) {
      return res.status(400).json({ error: 'Question ID and content are required' });
    }
    
    // Check if question exists
    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).json({ error: 'Question not found' });
    }
    
    const answer = new Answer({
      questionId,
      userId: req.user._id,
      content
    });
    
    await answer.save();
    
    // Create notification for question owner
    if (question.userId.toString() !== req.user._id.toString()) {
      const notification = new Notification({
        userId: question.userId,
        type: 'answer',
        message: `${req.user.username} answered your question: "${question.title}"`,
        link: `/questions/${questionId}`
      });
      await notification.save();
    }
    
    const populatedAnswer = await Answer.findById(answer._id)
      .populate('userId', 'username');
    
    res.status(201).json(populatedAnswer);
  } catch (error) {
    res.status(500).json({ error: 'Failed to post answer' });
  }
};

const updateAnswer = async (req, res) => {
  try {
    const answer = await Answer.findById(req.params.id);
    
    if (!answer) {
      return res.status(404).json({ error: 'Answer not found' });
    }
    
    if (answer.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized to edit this answer' });
    }
    
    const { content } = req.body;
    answer.content = content;
    await answer.save();
    
    const updatedAnswer = await Answer.findById(answer._id)
      .populate('userId', 'username');
    
    res.json(updatedAnswer);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update answer' });
  }
};

const voteAnswer = async (req, res) => {
  try {
    const { vote } = req.body; // 1 for upvote, -1 for downvote
    
    if (![1, -1].includes(vote)) {
      return res.status(400).json({ error: 'Vote must be 1 (upvote) or -1 (downvote)' });
    }
    
    const answer = await Answer.findById(req.params.id);
    if (!answer) {
      return res.status(404).json({ error: 'Answer not found' });
    }
    
    // Check if user already voted
    let existingVote = await Vote.findOne({
      userId: req.user._id,
      answerId: req.params.id
    });
    
    if (existingVote) {
      // Update existing vote
      if (existingVote.vote === vote) {
        // Remove vote if clicking same button
        await Vote.findByIdAndDelete(existingVote._id);
        if (vote === 1) {
          answer.upvotes -= 1;
        } else {
          answer.downvotes -= 1;
        }
      } else {
        // Change vote
        existingVote.vote = vote;
        await existingVote.save();
        
        // Remove old vote and add new vote
        if (existingVote.vote === 1) {
          answer.upvotes += 1;
          answer.downvotes -= 1;
        } else {
          answer.upvotes -= 1;
          answer.downvotes += 1;
        }
      }
    } else {
      // Create new vote
      const newVote = new Vote({
        userId: req.user._id,
        answerId: req.params.id,
        vote
      });
      await newVote.save();
      
      if (vote === 1) {
        answer.upvotes += 1;
      } else {
        answer.downvotes += 1;
      }
    }
    
    await answer.save();
    
    res.json({ 
      upvotes: answer.upvotes,
      downvotes: answer.downvotes,
      totalVotes: answer.totalVotes
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: 'You have already voted on this answer' });
    }
    res.status(500).json({ error: 'Failed to vote' });
  }
};

const getVotes = async (req, res) => {
  try {
    const votes = await Vote.find({ answerId: req.params.id })
      .populate('userId', 'username');
    
    // Count upvotes and downvotes
    const upvotes = votes.filter(vote => vote.vote === 1);
    const downvotes = votes.filter(vote => vote.vote === -1);
    
    res.json({
      votes,
      summary: {
        upvotes: upvotes.length,
        downvotes: downvotes.length,
        totalVotes: upvotes.length - downvotes.length
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch votes' });
  }
};

const deleteAnswer = async (req, res) => {
  try {
    const answer = await Answer.findById(req.params.id);
    
    if (!answer) {
      return res.status(404).json({ error: 'Answer not found' });
    }
    
    if (answer.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized to delete this answer' });
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

module.exports = {
  createAnswer,
  updateAnswer,
  voteAnswer,
  getVotes,
  deleteAnswer
}; 