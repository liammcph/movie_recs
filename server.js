

const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const methodOverride = require("method-override");
const morgan = require("morgan");
const session = require('express-session');


const port = process.env.PORT ? process.env.PORT : "3000";
const authController = require("./controllers/auth.js");


mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on("connected", () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});


/* middleware */
const Movie = require("./models/moviereview.js");
app.use("/images", express.static("images"));
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method"));
app.use(morgan("dev"));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

app.listen(port, () => {
  console.log(`The express app is ready on port ${port}!`);
});


// GET /
app.get("/", (req, res) => {
  res.render("landing.ejs", {
    user: req.session.user,
  });
});


/* AUTH */
app.use("/auth", authController);



// GET /movies/new
app.get("/movies/new", async (req, res) => {
  if (req.session.user) {
    const reviewCount = await Movie.countDocuments({ assignee: req.session.user._id });
    res.render("movies/new.ejs", { reviewCount });
  } else {
    res.redirect("/");
  }
});

app.get("/movies/:movieId", async (req, res) => {
  if (req.session.user) {
    const foundMovie = await Movie.findById(req.params.movieId);
    res.render("movies/show.ejs", { movie: foundMovie });
  } else {
    res.redirect("/");
  }
});

// POST /movies
app.post("/movies", async (req, res) => {
  if (req.session.user) {
    req.body.rating = Number(req.body.rating);
    req.body.assignee = req.session.user._id;
    await Movie.create(req.body);
    res.redirect("/movies");
  } else {
    res.redirect("/");
  }
});


// GET /movies
app.get("/movies", async (req, res) => {
  if (req.session.user) {
    const allMovies = await Movie.find({ assignee: req.session.user._id });
    res.render("movies/index.ejs", { movies: allMovies });
  } else {
    res.redirect("/");
  }
});

//delete
app.delete("/movies/:movieId", async (req, res) => {
  if (req.session.user) {
    await Movie.findByIdAndDelete(req.params.movieId);
    res.redirect("/movies");
  } else {
    res.redirect("/");
  }
});

// GET localhost:3000/movies/:movieId/edit
app.get("/movies/:movieId/edit", async (req, res) => {
  if (req.session.user) {
    const foundMovie = await Movie.findById(req.params.movieId);
    res.render("movies/edit.ejs", {
      movie: foundMovie,
    });
  } else {
    res.redirect("/");
  }
});

app.put("/movies/:movieId", async (req, res) => {
  if (req.session.user) {
    req.body.rating = Number(req.body.rating);
    await Movie.findByIdAndUpdate(req.params.movieId, req.body);
    res.redirect(`/movies/${req.params.movieId}`);
  } else {
    res.redirect("/");
  }
});



// GET /recommendations
app.get("/recommendations", async (req, res) => {
  if (req.session.user) {
    const topMovie = await Movie.findOne({ assignee: req.session.user._id }).sort({ rating: -1 });
    res.render("movies/recommendations.ejs", { topMovie });
  } else {
    res.redirect("/");
  }
});

/* app.listen(3000, () => {
  console.log("Listening on port 3000");
});
 */