const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
  topic: { type: String, default: 'General' },
  text: { type: String, required: true },
  options: [String],
  correctAnswerIndex: Number,
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium'
  },
  sourceFile: String
}, { timestamps: true });

QuestionSchema.index({ topic: 1, text: 1 }, { unique: true });

module.exports = mongoose.model('Question', QuestionSchema);
