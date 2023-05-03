const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    
  },
  description: {
    type: String,
    
  },
  location: {
    type: String,
    
  },
  salary: {
    type: Number,
    
  },
  requirements: {
    type: String,
    
  }
});

module.exports = mongoose.model('Job', jobSchema);
