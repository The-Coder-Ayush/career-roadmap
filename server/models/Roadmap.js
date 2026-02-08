const mongoose = require('mongoose');

const RoadmapSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  summary: String,
  salary_range: String,
  growth_score: Number,
  steps: [
    {
      step_number: Number,
      title: String,
      description: String,
      duration: String,
      resources: [String],
      completed: { type: Boolean, default: false } // We will use this later for tracking!
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Roadmap', RoadmapSchema);