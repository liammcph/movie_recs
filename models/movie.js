

const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  name: String,
  rating: Number,
  review: String,
});

const Movie = mongoose.model("Movie", movieSchema);

module.exports = Movie;
