const mongoose = require('mongoose');

// Tạo schema cho Study
const studySchema = new mongoose.Schema({
  title: { type: String, required: true },
  subtitle: { type: String, required: true },
  wordCount: { type: Number, required: true },
  category: { type: String, required: true },
});

// Tạo model cho Study
const Study = mongoose.model('Study', studySchema);

module.exports = Study;
