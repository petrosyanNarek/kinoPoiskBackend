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
const { validationResult } = require("express-validator");
const chekValidation = require("./hooks/chekValidation");
const unlinkFile = require("./hooks/unlinkFiles");
const unlinkFiles = require("./hooks/unlinkFiles");

class FilmController {
  static async addFilm(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).end(errors.array()[0].msg);
    }
    let { genres, countries, actors, authors, ...film } = req.body;
    if (req.files.cardImg && req.files.trailer && req.files.video) {
      const cardImg = req.files.cardImg[0].path;
      const trailer = req.files.trailer[0].path;
      const video = req.files.video[0].path;

      if (countries && actors && authors && genres) {
        if (await chekValidation(genres, Genre) && await chekValidation(countries, Country) && await chekValidation(actors, Actor) && await chekValidation(authors, Author)) {
          const newFilm = await Film.create({
            ...film,
            cardImg,
            trailer,
            video,
          });
          countries = countries.map((countr) => {
            return { filmId: newFilm.id, countryId: +countr };
          });

          await FilmCountryController.addFilmCountry(countries);
          genres = genres.map((genr) => {
            return { filmId: newFilm.id, genreId: +genr };
          });
          await FilmGenreController.addFilmGenre(genres);

          actors = actors.map((item) => {
            return {
              filmId: newFilm.id,
              actorId: +item,
            };
          });
          await ActorFilmController.newActorFilm(actors);

          authors = authors.map((item) => {
            return { filmId: newFilm.id, authorId: +item };
          });
          await AuthorFilmController.newAuthorFilm(authors);

          return res.status(200).send("created");
        } else {

          return res
            .status(400)
            .send("Not valide genres, countries, actors or authors");
        }
      } else {
        unlinkFiles([cardImg, video, trailer])
        return res
          .status(400)
          .send("Not valide genres, countries, actors or authors");
      }
    } else {
      return res.status(400).send("Not valide image , video or trailer");
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
    try {
      let { id, genres, countries, actors, authors, ...film } = req.body;
      let cardImg, trailer, video;
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).end(errors.array()[0].msg);
      }

      await FilmGenreController.deleteFilmGenres(id, genres);
      genres = genres.map((genr) => {
        return { filmId: id[0], genreId: +genr };
      });
      await FilmGenreController.updateFilmGenres(genres);

      await FilmCountryController.deleteFilmCountries(id, countries);
      countries = countries.map((country) => {
        return { filmId: id[0], countryId: +country };
      });
      await FilmCountryController.updateFilmCountries(countries);

      await AuthorFilmController.deleteFilmAuthors(id, authors);
      authors = authors.map((author) => {
        return { filmId: id[0], authorId: +author };
      });
      await AuthorFilmController.updateFilmAuthors(authors);

      await ActorFilmController.deleteFilmCountries(id, actors);
      actors = actors.map((actor) => {
        return { filmId: id[0], actorId: +actor };
      });
      await ActorFilmController.updateFilmCountries(actors);

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
      await Film.update(
        {
          ...film,
          cardImg,
          trailer,
          video,
        },
        {
          where: {
            id: id[0],
          },
        }
      );

      return res.status(200).send("updated");
    } catch {
      return res.status(505).send("Network Error")
    }
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
