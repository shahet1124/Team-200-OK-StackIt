const Question = require('../models/Question');
const Answer = require('../models/Answer');

const getAllQuestions = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    // Use aggregation to get questions with answer counts
    const questions = await Question.aggregate([
      {
        $lookup: {
          from: 'answers',
          localField: '_id',
          foreignField: 'questionId',
          as: 'answers'
        }
      },
      {
        $addFields: {
          answerCount: { $size: '$answers' }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'user'
        }
      },
      {
        $unwind: '$user'
      },
      {
        $project: {
          _id: 1,
          title: 1,
          description: 1,
          tags: 1,
          userId: {
            _id: '$user._id',
            username: '$user.username'
          },
          acceptedAnswerId: 1,
          createdAt: 1,
          updatedAt: 1,
          answerCount: 1
        }
      },
      {
        $sort: { createdAt: -1 }
      },
      {
        $skip: skip
      },
      {
        $limit: limit
      }
    ]);
    
    const total = await Question.countDocuments();
    
    res.json({
      questions,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch questions' });
  }
};

const getQuestionById = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id)
      .populate('userId', 'username')
      .populate('acceptedAnswerId');
    
    if (!question) {
      return res.status(404).json({ error: 'Question not found' });
    }
    
    const answers = await Answer.find({ questionId: req.params.id })
      .populate('userId', 'username')
      .sort({ totalVotes: -1, createdAt: -1 }); // Sort by total votes (upvotes - downvotes)
    
    res.json({ question, answers });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch question' });
  }
};

const createQuestion = async (req, res) => {
  try {
    const { title, description, tags } = req.body;
    
    if (!title || !description) {
      return res.status(400).json({ error: 'Title and description are required' });
    }
    
    const question = new Question({
      title,
      description,
      tags: tags || [],
      userId: req.user._id
    });
    
    await question.save();
    
    const populatedQuestion = await Question.findById(question._id)
      .populate('userId', 'username');
    
    res.status(201).json(populatedQuestion);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create question' });
  }
};

const updateQuestion = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    
    if (!question) {
      return res.status(404).json({ error: 'Question not found' });
    }
    
    if (question.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized to edit this question' });
    }
    
    const { title, description, tags } = req.body;
    
    question.title = title || question.title;
    question.description = description || question.description;
    question.tags = tags || question.tags;
    
    await question.save();
    
    const updatedQuestion = await Question.findById(question._id)
      .populate('userId', 'username');
    
    res.json(updatedQuestion);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update question' });
  }
};

const acceptAnswer = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    
    if (!question) {
      return res.status(404).json({ error: 'Question not found' });
    }
    
    if (question.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized to accept answers for this question' });
    }
    
    const answer = await Answer.findById(req.params.answerId);
    if (!answer || answer.questionId.toString() !== req.params.id) {
      return res.status(404).json({ error: 'Answer not found' });
    }
    
    question.acceptedAnswerId = req.params.answerId;
    await question.save();
    
    res.json({ message: 'Answer accepted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to accept answer' });
  }
};

const searchByTags = async (req, res) => {
  try {
    const { tags } = req.query;
    if (!tags) {
      return res.status(400).json({ error: 'Tags parameter is required' });
    }
    
    const tagArray = tags.split(',').map(tag => tag.trim());
    
    // Use aggregation for search with answer counts
    const questions = await Question.aggregate([
      {
        $match: {
          tags: { $in: tagArray }
        }
      },
      {
        $lookup: {
          from: 'answers',
          localField: '_id',
          foreignField: 'questionId',
          as: 'answers'
        }
      },
      {
        $addFields: {
          answerCount: { $size: '$answers' }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'user'
        }
      },
      {
        $unwind: '$user'
      },
      {
        $project: {
          _id: 1,
          title: 1,
          description: 1,
          tags: 1,
          userId: {
            _id: '$user._id',
            username: '$user.username'
          },
          acceptedAnswerId: 1,
          createdAt: 1,
          updatedAt: 1,
          answerCount: 1
        }
      },
      {
        $sort: { createdAt: -1 }
      }
    ]);
    
    res.json(questions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to search questions' });
  }
};

module.exports = {
  getAllQuestions,
  getQuestionById,
  createQuestion,
  updateQuestion,
  acceptAnswer,
  searchByTags
}; 