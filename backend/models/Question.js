const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true }, // HTML or Markdown
  tags: [{ type: String }], // e.g., ["react", "jwt"]
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  acceptedAnswerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Answer' }, // nullable
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Update the updatedAt field before saving
QuestionSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Question', QuestionSchema); 