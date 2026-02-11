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
  summary: {
    type: String
  },
  salary_range: {
    type: String
  },
  growth_score: {
    type: Number
  },
  steps: [
    {
      title: { type: String },
      description: { type: String },
      duration: { type: String },
      resources: [{ type: String }], // Array of strings for links/topics
       completed: { type: Boolean, default: false }
       }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Roadmap', RoadmapSchema);