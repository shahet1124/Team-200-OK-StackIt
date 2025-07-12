const mongoose = require('mongoose');

const AnswerSchema = new mongoose.Schema({
  questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Question', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true }, // HTML
  upvotes: { type: Number, default: 0 }, // separate upvote count
  downvotes: { type: Number, default: 0 }, // separate downvote count
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Update the updatedAt field before saving
AnswerSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Virtual for total votes (upvotes - downvotes)
AnswerSchema.virtual('totalVotes').get(function() {
  return this.upvotes - this.downvotes;
});

// Ensure virtual fields are serialized
AnswerSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Answer', AnswerSchema); 