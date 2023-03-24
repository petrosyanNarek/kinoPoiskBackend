const express = require("express");
const passport = require("passport");
const app = express();
const cors = require("cors");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");

const LocalStrategy = require("passport-local").Strategy;
const { GenreController } = require("./controlers/GenreController");
const { FilmController } = require("./controlers/FilmController");
const { CountryController } = require("./controlers/CountryController");
const { SeriesController } = require("./controlers/SeriesController");
const { CategoryController } = require("./controlers/CategoryController");
const { ActorController } = require("./controlers/ActorController");
const { AuthorController } = require("./controlers/AuthorController");
const { CommentController } = require("./controlers/CommentController");
const { FilmViewController } = require("./controlers/FilmViewController");
const { UserController } = require("./controlers/UserController");
const { AdminController } = require("./controlers/AdminController");
const { User } = require("./models");
const { Admin } = require("./models");

const {
  CommentRatingController,
} = require("./controlers/CommentRatingController");
const { CommentAnwserController } = require("./controlers/CommentAnwser");
const { checkSchema } = require("express-validator");
const validShema = require("./validation/validShema");
const { text, country } = require("./validation/regexpValidation");

const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    if (file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      callback(null, "./public/images");
    } else if (file.originalname.match(/\.(mp4)$/)) {
      callback(null, "./public/video");
    }
  },
  filename: function (req, file, callback) {
    callback(null, file.fieldname + "-" + file.originalname);
  },
});

const upload = multer({
  storage: storage,
});

module.exports = dirPath = path.join(__dirname);
app.use("/public", express.static("public"));
app.use(
  require("express-session")({
    secret: "keyboard cat",
    resave: true,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use(express.json()); // for parsing application/json
app.use(
  express.urlencoded({
    extended: true,
  })
); // for parsing application/x-www-form-urlencoded

app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

passport.use(
  "admin",
  new LocalStrategy(
    {
      usernameField: "email",
    },
    AdminController.loginCheck
  )
);

passport.use(
  "user",
  new LocalStrategy(
    {
      usernameField: "email",
    },
    UserController.LoginCheck
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

////User
app.post("/login", UserController.Login);
app.post("/addUser", UserController.addUser);
app.post("/getUser", UserController.GetUser);
app.post("/logOut", UserController.Logout);

////Admin
app.post("/loginAdmin", AdminController.login);
app.post("/addAdmin", AdminController.newAdmin);
app.post("/getAdmin", AdminController.getAdmin);
app.post("/logOutAdmin", AdminController.logout);

///Category
app.get("/category/allCategory", CategoryController.getAllCategory);
app.get("/category/getCategoryById", CategoryController.getCategoryById);
app.post(
  "/category/newCategory",
  checkSchema(validShema.add("Category")),
  CategoryController.addCategory
);
app.post(
  "/category/getFilteredCategories",
  CategoryController.getFilteredCategories
);
app.delete("/category/deleteCategory", CategoryController.deleteCategory);
app.put(
  "/category/updateCategory",
  checkSchema(validShema.eddit("Category")),
  CategoryController.updateCategory
);

///Genre
app.get("/genre/allGenre", GenreController.getAllGenre);
app.get("/genre/getGenreById", GenreController.getGenreById);
app.get("/genre/getGenreFilm", GenreController.getFilmByGenre);
app.post(
  "/genre/newGenre",
  checkSchema(validShema.add("Genre")),
  GenreController.addGenre
);
app.post("/genre/getFilteredGenre", GenreController.getFilteredGenres);
app.delete("/genre/deleteGenre", GenreController.deleteGenre);
app.put(
  "/genre/updateGenre",
  checkSchema(validShema.eddit("Genre")),
  GenreController.updateGenre
);

///Country
app.get("/country/allCountry", CountryController.getAllCountry);
app.get("/country/getCountryById", CountryController.getCountryById);
app.post(
  "/country/newCountry",
  checkSchema(
    validShema.add("Country", 2, {
      test: country,
      message:
        "Only alphabets are allowed and all letter must been to upper case",
    })
  ),
  CountryController.addCountry
);
app.post(
  "/country/getFilteredCountries",
  CountryController.getFilteredCountries
);
app.delete("/country/deleteCountry", CountryController.deleteCountry);
app.put(
  "/country/updateCountry",
  checkSchema(
    validShema.eddit("Country", 2, 15, {
      test: country,
      message:
        "Only alphabets are allowed and all letter must been to upper case",
    })
  ),
  CountryController.updateCountry
);

///actor
app.post("/actor/addActor", ActorController.addActor);
app.post("/actor/getFilteredActors", ActorController.getFilteredActor);
app.delete("/actor/deleteActor", ActorController.deleteActor);
app.put("/actor/updateActor", ActorController.updateActor);
app.get("/actor/getActor", ActorController.getActorById);
app.get("/actor/allActors", ActorController.getAllActors);

///author
app.post("/author/addAuthor", AuthorController.addAuthor);
app.delete("/author/deleteAuthor", AuthorController.deleteAuthor);
app.put("/author/updateAuthor", AuthorController.updateAuthor);

app.get("/author/getAuthor", AuthorController.getAuthorById);
app.get("/author/allAuthors", AuthorController.getAllAuthor);
app.post("/author/getFilteredAuthors", AuthorController.getFilteredAuthor);

///Film
app.get("/film/allFilm", FilmController.getAllFilm);
app.get("/film/filmById", FilmController.getFilmById);
app.post("/film/sordAndFilter", FilmController.sortAndFilteresFilms);

app.post(
  "/film/newFilm",
  upload.fields([
    {
      name: "cardImg",
    },
    {
      name: "trailer",
    },
    {
      name: "video",
    },
  ]),
  FilmController.addFilm
);
app.delete("/film/deleteFilm", FilmController.deleteFilm);
app.put(
  "/film/updateFilm",
  upload.fields([
    {
      name: "cardImg",
    },
    {
      name: "trailer",
    },
    {
      name: "video",
    },
  ]),
  FilmController.updateFilm
);
app.put("/film/updateFilmRating", FilmController.updateFilmRating);

///Series
app.post(
  "/series/newSeries",
  upload.fields([
    {
      name: "cardImg",
    },
    {
      name: "trailer",
    },
    {
      name: "video",
    },
  ]),
  SeriesController.addSeries
);
app.put(
  "/series/updateSeries",
  upload.fields([
    {
      name: "cardImg",
    },
    {
      name: "trailer",
    },
    {
      name: "video",
    },
  ]),
  SeriesController.updateSeries
);
app.delete("/series/deleteSeries", SeriesController.deleteSeries);

app.get("/series/getSeriesFilm", SeriesController.getSeriesByFilmId);
app.get("/series/getSeriesById", SeriesController.getSeriesById);
app.get("/series/getSeries", SeriesController.getSeries);
app.post("/series/getFilteredSeries", SeriesController.sortAndFilteresSeries);
app.put("/series/updateFilmRating", SeriesController.updateSeriesRating);

///comment
app.post("/comment/newComment", CommentController.newComment);
app.delete("/comment/deleteComment", CommentController.deleteComment);
app.put("/comment/updateComment", CommentController.updateComment);

/////
app.post("/commentAnwser/newComment", CommentAnwserController.newComment);

////FilmView
app.get("/filmview/add", FilmViewController.addFilmView);

////CommentRating
app.post("/commentRating", CommentRatingController.addCommentRating);
app.get("/commentAnwsers", CommentAnwserController.getCommentAnwser);

// Socet io

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  socket.on("join_room", (data) => {
    socket.join(data);
  });

  socket.on("send_message", (data) => {
    socket.to(data.room).emit("receive_message", data);
  });
});

///Server
server.listen(process.env.SERVER_PORT || 3000, () => {
  console.log("listening on *:3000");
});
