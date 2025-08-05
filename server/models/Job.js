const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  company: { type: String, required: true }, 
  description: { type: String, required: true },
  skills: { type: [String], default: [] },
  budget: { type: Number, required: true },
  location: { type: String },
  endDate: { type: Date },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  applicants: [
    {
      type: mongoose.Schema.Types.Mixed, 
      ref: 'User'
    }
  ], 
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Job', jobSchema);
