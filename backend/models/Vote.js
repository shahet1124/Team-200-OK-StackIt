const mongoose = require('mongoose');

const VoteSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  answerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Answer', required: true },
  vote: { type: Number, required: true, enum: [1, -1] } // 1 for upvote, -1 for downvote
});

// Create unique compound index to prevent duplicate votes
VoteSchema.index({ userId: 1, answerId: 1 }, { unique: true });

module.exports = mongoose.model('Vote', VoteSchema); 