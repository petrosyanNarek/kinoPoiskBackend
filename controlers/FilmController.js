const { Op } = require("sequelize");
const { Film, Genre, Country, Series, Actor, Author } = require("../models");
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
    const { genres, countries, actors, authors, ...film } = req.body;
    try {
      const cardImg = `http://localhost:3000/${req.files.cardImg[0].path}`;
      const trailer = `http://localhost:3000/${req.files.trailer[0].path}`;
      const video = `http://localhost:3000/${req.files.video[0].path}`;
      // const sliderImg = `http://localhost:3000/${req.files.sliderImg[0].path}`;
      const newFilm = await Film.create({
        ...film,
        cardImg,
        trailer,
        video,
        // sliderImg,
      });
      countries.forEach((countr) => {
        FilmCountryController.addFilmCountry({
          filmId: newFilm.id,
          countryId: +countr,
        });
      });
      genres.forEach((genr) => {
        FilmGenreController.addFilmGenre({
          filmId: newFilm.id,
          genreId: +genr,
        });
      });
      actors.forEach((item) => {
        ActorFilmController.newActorFilm({
          filmId: newFilm.id,
          actorId: +item,
        });
      });
      authors.forEach((item) => {
        AuthorFilmController.newAuthorFilm({
          filmId: newFilm.id,
          authorId: +item,
        });
      });

      res.status(200).send("created");
    } catch (err) {
      res.status(500).send("Error 500");
    }
  }

  static async updateFilm(req, res) {
    let { id, genre, country, actor, author, ...film } = req.body;
    let cardImg, trailer, video;
    //  sliderImg;
    if (req.files.cardImg) {
      cardImg = `http://localhost:3000/${req.files.cardImg[0].path}`;
    }

    if (req.files.trailer) {
      trailer = `http://localhost:3000/${req.files.trailer[0].path}`;
    }
    if (req.files.video) {
      video = `http://localhost:3000/${req.files.video[0].path}`;
    }
    // if (req.files.sliderImg) {
    //   sliderImg = `http://localhost:3000/${req.files.sliderImg[0].path}`;
    // }
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
    // if (sliderImg) {
    //   const sliderImgPath = getFilm.sliderImg.split("\\");
    //   fs.unlink(
    //     process.cwd() +
    //       "/public/images/" +
    //       sliderImgPath[sliderImgPath.length - 1],
    //     (err) => {
    //       if (err) {
    //         return new Error(err);
    //       }
    //     }
    //   );
    // }
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

    if (country) {
      await FilmCountryController.deleteFilmCountry(id);
      country.forEach((countr) => {
        FilmCountryController.addFilmCountry({
          filmId: id,
          countryId: +countr,
        });
      });
    }
    if (genre) {
      await FilmGenreController.deleteFilmGenre(id);
      genre.forEach((genr) => {
        FilmGenreController.addFilmGenre({ filmId: id, genreId: +genr });
      });
    }

    if (actor) {
      await ActorFilmController.deleteActorFilm(id);
      actor.forEach((item) => {
        ActorFilmController.newActorFilm({ filmId: id, actorId: +item });
      });
    }
    if (author) {
      await AuthorFilmController.deleteAuthorFilm(id);
      author.forEach((item) => {
        AuthorFilmController.newAuthorFilm({ filmId: id, authorId: +item });
      });
    }
    film = Object.fromEntries(Object.entries(film).filter(([_, v]) => v != ""));
    const updateFilm = await Film.update(
      {
        ...film,
        cardImg,
        trailer,
        video,
        // sliderImg,
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
    const cardImgPath = getDeletedFilm.cardImg.split("\\");
    fs.unlink(
      process.cwd() + "/public/images/" + cardImgPath[cardImgPath.length - 1],
      (err) => {
        if (err) {
          return new Error(err);
        }
      }
    );
    const sliderImgPath = getDeletedFilm.sliderImg.split("\\");
    fs.unlink(
      process.cwd() +
        "/public/images/" +
        sliderImgPath[sliderImgPath.length - 1],
      (err) => {
        if (err) {
          return new Error(err);
        }
      }
    );
    const trailerPath = getDeletedFilm.trailer.split("\\");
    fs.unlink(
      process.cwd() + "/public/video/" + trailerPath[trailerPath.length - 1],
      (err) => {
        if (err) {
          return new Error(err);
        }
      }
    );

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
      include: [
        { model: Genre, required: true },
        { model: Country, required: true },
        { model: Actor, required: true },
        { model: Author, required: true },
      ],
    });
    const film2 = await Film.findOne({
      where: {
        id: +id,
      },
      include:
        film.categoryId == 2
          ? [
              { model: Genre, required: true },
              { model: Country, required: true },
              { model: Actor, required: true },
              { model: Author, required: true },
              { model: Series, required: true },
            ]
          : [
              { model: Genre, required: true },
              { model: Country, required: true },
              { model: Actor, required: true },
              { model: Author, required: true },
            ],
    });
    if (film2) {
      res.status(200).send(film2);
    } else {
      res.status(404).send("Not Found");
    }
  }

  static async getFilmsBy(req, res) {
    const { filterBy } = req.body;
    const film = await Film.findAll({
      where: filterBy,
      include: [
        { model: Genre, required: true },
        { model: Country, required: true },
      ],
    });
    if (film) {
      res.status(200).send(film);
    } else {
      res.status(404).send("Not Found");
    }
  }

  static async getTopViewedFilms(req, res) {
    const { page, limit } = pageLimitChek(req.headers.page, req.headers.limit);
    const films = await Film.findAll({
      where: {
        views: {
          [Op.gte]: 21005,
        },
      },
    });
    const topViewedFilms = await Film.findAll({
      where: {
        views: {
          [Op.gte]: 21005,
        },
      },
      include: [
        { model: Genre, required: true },
        { model: Country, required: true },
      ],
      limit,
      offset: page,
    });
    res.status(200).send({
      film: topViewedFilms,
      totoalFilmCount: films.length,
      totalPageCount: Math.ceil(films.length / limit),
    });
  }
  static async getTopRratingFilms(req, res) {
    const { page, limit } = pageLimitChek(req.headers.page, req.headers.limit);
    const films = await Film.findAll({
      where: {
        rating: 5,
      },
    });
    const topRatingFilms = await Film.findAll({
      where: {
        rating: 5,
      },
      include: [
        { model: Genre, required: true },
        { model: Country, required: true },
      ],
      limit,
      offset: page,
    });
    res.status(200).send({
      films: topRatingFilms,
      totoalFilmCount: films.length,
      totalPageCount: Math.ceil(films.length / limit),
    });
  }
  static async getRecentlyAddedFilms(req, res) {
    const { page, limit } = pageLimitChek(req.headers.page, req.headers.limit);
    const films = await Film.findAll();
    const topRecentlyAddedFilms = await Film.findAll({
      order: [["createdAt", "DESC"]],
      include: [
        { model: Genre, required: true },
        { model: Country, required: true },
      ],
      limit,
      offset: page,
    });
    res.status(200).send({
      films: topRecentlyAddedFilms,
      totoalFilmCount: films.length,
      totalPageCount: Math.ceil(films.length / limit),
    });
  }

  static async getFilmByCategory(req, res) {
    const { category_id } = req.headers;
    const { page, limit } = pageLimitChek(req.headers.page, req.headers.limit);
    const films = await Film.findAll({
      where: {
        categoryId: category_id,
      },
    });
    const filmByCategory = await Film.findAll({
      where: {
        categoryId: category_id,
      },
      limit,
      offset: page,
    });
    res.status(200).send({
      films: filmByCategory,
      totoalFilmCount: films.length,
      totalPageCount: Math.ceil(films.length / limit),
    });
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
