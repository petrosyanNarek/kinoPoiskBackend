const { Op } = require("sequelize");
const {
  Film,
  Genre,
  Country,
  Series,
  Actor,
  Author,
  Comment,
  User,
  CommentAnwsers,
  CommentRating,
} = require("../models");
const { ActorFilmController } = require("./ActorFilmController");
const { AuthorFilmController } = require("./AuthorFilmController");
const { FilmCountryController } = require("./FilmCountryController");
const { FilmGenreController } = require("./FilmGenreController");
const checkAndReplace = require("./hooks/checkAndReplace");
const checkIncludeFilterItems = require("./hooks/checkIncludeFilterItems");
const pageLimitChek = require("./hooks/pageLimitChek");
const sortBySearchBy = require("./hooks/sortBySearchBy");
const fs = require("fs");

class FilmController {
  static async addFilm(req, res) {
    let { genres, countries, actors, authors, ...film } = req.body;
    try {
      const cardImg = req.files.cardImg[0].path;
      const trailer = req.files.trailer[0].path;
      const video = req.files.video[0].path;
      const newFilm = await Film.create({
        ...film,
        cardImg,
        trailer,
        video,
      });

      countries = countries.map((countr) => {
        return { filmId: newFilm.id, countryId: +countr };
      });

      FilmCountryController.addFilmCountry(countries);
      genres = genres.map((genr) => {
        return { filmId: newFilm.id, genreId: +genr };
      });
      FilmGenreController.addFilmGenre(genres);

      actors = actors.map((item) => {
        return {
          filmId: newFilm.id,
          actorId: +item,
        };
      });
      ActorFilmController.newActorFilm(actors);

      authors = authors.map((item) => {
        return { filmId: newFilm.id, authorId: +item };
      });
      AuthorFilmController.newAuthorFilm(authors);

      res.status(200).send("created");
    } catch (err) {
      res.status(500).send("Error 500");
    }
  }

  static async updateFilmRating(req, res) {
    const { id, rating } = req.body;
    await Film.update(
      {
        rating,
      },
      {
        where: {
          id,
        },
      }
    );
    res.status(200);
  }

  static async updateFilm(req, res) {
    let { id, genres, countries, actors, authors, ...film } = req.body;
    let cardImg, trailer, video;

    const filmGenres = await FilmGenreController.getAllFilmGenre(id[0]);
    let newGenres = [];
    for (let i = 0; i < filmGenres.length; i++) {
      let a = genres.find((e) => e === filmGenres[i].genreId);
      if (!a) {
        newGenres.push(filmGenres[i].genreId);
      }
    }

    await FilmGenreController.deleteFilmGenres(id, newGenres);
    genres = genres.map((genr) => {
      return { filmId: id[0], genreId: +genr };
    });
    await FilmGenreController.updateFilmGenres(genres);

    const filmCountries = await FilmCountryController.getAllFilmCountry(id[0]);
    let newCountries = [];
    for (let i = 0; i < filmCountries.length; i++) {
      let a = countries.find((e) => e === filmCountries[i].countryId);
      if (!a) {
        newCountries.push(filmCountries[i].countryId);
      }
    }

    await FilmCountryController.deleteFilmCountries(id, newCountries);
    countries = countries.map((country) => {
      return { filmId: id[0], countryId: +country };
    });
    await FilmCountryController.updateFilmCountries(countries);

    const filmAuthors = await AuthorFilmController.getAllAuthorFilm(id[0]);
    let newAuthors = [];
    for (let i = 0; i < filmAuthors.length; i++) {
      let a = authors.find((e) => e === filmAuthors[i].authorId);
      if (!a) {
        newAuthors.push(filmAuthors[i].authorId);
      }
    }

    await AuthorFilmController.deleteFilmAuthors(id, newAuthors);
    authors = authors.map((author) => {
      return { filmId: id[0], authorId: +author };
    });
    await AuthorFilmController.updateFilmAuthors(authors);

    const filmActors = await ActorFilmController.getAllFilmActor(id[0]);
    let newActor = [];
    for (let i = 0; i < filmActors.length; i++) {
      let a = actors.find((e) => e === filmActors[i].actorId);
      if (!a) {
        newActor.push(filmActors[i].actorId);
      }
    }

    await ActorFilmController.deleteFilmCountries(id, newActor);
    actors = actors.map((actor) => {
      return { filmId: id[0], actorId: +actor };
    });
    await ActorFilmController.updateFilmCountries(actors);

    res.send({ actors, filmActors, newActor });
    if (req.files.cardImg) {
      cardImg = req.files.cardImg[0].path;
    }

    if (req.files.trailer) {
      trailer = req.files.trailer[0].path;
    }
    if (req.files.video) {
      video = req.files.video[0].path;
    }

    const getFilm = await Film.findOne({ where: { id: +id[0] } });
    if (cardImg) {
      const cardImgPath = getFilm.cardImg.split("\\");
      fs.unlink(
        process.cwd() + "/public/images/" + cardImgPath[cardImgPath.length - 1],
        (err) => {
          if (err) {
            return new Error(err);
          }
        }
      );
    }

    if (trailer) {
      const trailerPath = getFilm.trailer.split("\\");
      fs.unlink(
        process.cwd() + "/public/video/" + trailerPath[trailerPath.length - 1],
        (err) => {
          if (err) {
            return new Error(err);
          }
        }
      );
    }
    if (video) {
      const videoPath = getFilm.video.split("\\");
      fs.unlink(
        process.cwd() + "/public/video/" + videoPath[videoPath.length - 1],
        (err) => {
          if (err) {
            return new Error(err);
          }
        }
      );
    }

    film = Object.fromEntries(Object.entries(film).filter(([_, v]) => v != ""));
    const updateFilm = await Film.update(
      {
        ...film,
        cardImg,
        trailer,
        video,
      },
      {
        where: {
          id,
        },
      }
    );

    res.status(200).send(updateFilm);
  }

  static async deleteFilm(req, res) {
    const id = req.body.id;

    const getDeletedFilm = await Film.findOne({
      where: {
        id,
      },
    });
    fs.unlink(process.cwd() + getDeletedFilm.cardImg, (err) => {
      if (err) {
        return new Error(err);
      }
    });
    fs.unlink(process.cwd() + getDeletedFilm.trailer, (err) => {
      if (err) {
        return new Error(err);
      }
    });
    fs.unlink(process.cwd() + getDeletedFilm.video, (err) => {
      if (err) {
        return new Error(err);
      }
    });

    const deletedFilm = await Film.destroy({
      where: {
        id,
      },
    });
    if (deletedFilm) {
      res.status(200).send("deleted");
    } else {
      res.status(404).send("Not found");
    }
  }

  static async getAllFilm(req, res) {
    const films = await Film.findAll({
      where: {
        categoryId: {
          [Op.or]: [2, 3],
        },
      },
      include: [
        { model: Genre, required: true },
        { model: Country, required: true },
        { model: Actor, required: true },
        { model: Author, required: true },
      ],
    });
    res.status(200).send(films);
  }

  static async getFilmById(req, res) {
    const { id } = req.headers;
    const film = await Film.findOne({
      where: {
        id: +id,
      },
    });
    const film2 = await Film.findOne({
      where: {
        id: +id,
      },
      include: [
        { model: Genre, required: true },
        { model: Country, required: true },
        { model: Actor, required: true },
        { model: Author, required: true },
        { model: Series },
        {
          model: Comment,
          attributes: [
            "id",
            "message",
            "commentLike",
            "commentDisLike",
            "createdAt",
          ],
          include: [
            {
              model: User,
              attributes: ["fullName", "id"],
            },
            {
              model: CommentRating,
              include: [
                {
                  model: User,
                  attributes: ["fullName", "id"],
                },
              ],
            },
            {
              model: CommentAnwsers,
              include: [
                {
                  model: User,
                  attributes: ["fullName", "id"],
                },
                {
                  model: CommentRating,
                  include: [
                    {
                      model: User,
                      attributes: ["fullName", "id"],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    });
    if (film2) {
      res.status(200).send(film2);
    } else {
      res.status(404).send("Not Found");
    }
  }

  static async sortAndFilteresFilms(req, res) {
    try {
      const { page, limit } = pageLimitChek(req.body.page, req.body.limit);
      let includeFilterItems = [];
      const sortBy = req.body.sortBy || "createdAt";
      const sortOrder = req.body.sortOrder || "DESC";
      const filterValue = req.body.filterValue || "";
      const categoryId = req.body.categoryId || "";
      const genres = checkAndReplace(req.body.genres);
      includeFilterItems = checkIncludeFilterItems(
        includeFilterItems,
        genres,
        Genre
      );
      const countries = checkAndReplace(req.body.countries);
      includeFilterItems = checkIncludeFilterItems(
        includeFilterItems,
        countries,
        Country
      );
      const authors = checkAndReplace(req.body.authors);
      includeFilterItems = checkIncludeFilterItems(
        includeFilterItems,
        authors,
        Author
      );
      const actors = checkAndReplace(req.body.authors);
      includeFilterItems = checkIncludeFilterItems(
        includeFilterItems,
        actors,
        Actor
      );
      const {
        cardImg,
        video,
        trailer,
        cratedAt,
        sliderImg,
        createdAt,
        updatedAt,
        id,
        ...film
      } = Film.rawAttributes;
      const attributes = Object.keys(film);

      const options = sortBySearchBy(
        sortBy,
        sortOrder,
        attributes,
        filterValue,
        includeFilterItems,
        categoryId
      );
      const results = await Film.findAll({
        ...options,
      });

      let films = await Film.findAll({
        ...options,
        limit,
        offset: page,
      });
      res.status(200).send({
        films,
        totoalFilmCount: results.length,
        totalPageCount: Math.ceil(results.length / limit),
      });
    } catch (err) {
      res.status(500).send(err);
    }
  }
}

module.exports = { FilmController };
