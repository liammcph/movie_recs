

const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  name: String,
  haveSeen: Boolean,
});

const Movie = mongoose.model("Movie", movieSchema);

module.exports = Movie;
