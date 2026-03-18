

const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  name: String,
  rating: Number,
  review: String,
   assignee: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User' // Reference to the User model
  }
});

const Movie = mongoose.model("Movie", movieSchema);

module.exports = Movie;
