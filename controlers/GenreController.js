const { validationResult } = require("express-validator");
const { Genre, Film } = require("../models");
const pageLimitChek = require("./hooks/pageLimitChek");
const sortBySearchBy = require("./hooks/sortBySearchBy");
class GenreController {
  static async addGenre(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).send(errors.array()[0].msg);
      }
      const data = req.body.genre;
      await Genre.create(data);
      return res.status(200).send("created");
    } catch {
      return res.status(500).send("Network Error");
    }
  }
  static async deleteGenre(req, res) {
    try {
      const id = req.body.id;
      const deletedGenre = await Genre.destroy({
        where: {
          id,
        },
      });
      if (deletedGenre) {
        res.status(200).send("deleted");
      } else {
        res.status(404).send("Not found");
      }
    } catch {
      res.status(404);
    }
  }
  static async updateGenre(req, res) {
    try {
      const { id, genre } = req.body;
      await Genre.update(
        {
          ...genre,
        },
        {
          where: {
            id,
          },
        }
      );
      res.status(200).send("updated");
    } catch {
      res.status(404).send("Not Found");
    }
  }
  static async getAllGenre(req, res) {
    try {
      const allGenre = await Genre.findAll();
      res.status(200).send(allGenre);
    } catch {
      res.status(404);
    }
  }
  static async getGenreById(req, res) {
    const { id } = req.headers;
    const genre = await Genre.findOne({
      where: {
        id,
      },
    });
    res.status(200).send(genre);
  }
  static async getFilteredGenres(req, res) {
    const { page, limit } = pageLimitChek(req.body.page, req.body.limit);
    const sortBy = req.body.sortBy || "createdAt";
    const sortOrder = req.body.sortOrder || "DESC";
    const filterValue = req.body.filterValue || "";
    const attributes = Object.keys(Genre.rawAttributes);

    const options = sortBySearchBy(sortBy, sortOrder, attributes, filterValue);

    const results = await Genre.findAll(options);
    let genres = await Genre.findAll({
      ...options,
      limit,
      offset: page,
    });
    res.status(200).send({
      genres,
      totoalActorsCount: results.length,
      totalPageCount: Math.ceil(results.length / limit),
    });
  }
  static async getFilmByGenre(req, res) {
    const { id } = req.headers;

    const genresFilm = await Genre.findOne({
      where: {
        id,
      },
      include: [{ model: Film, required: true }],
    });

    res.status(200).send(genresFilm);
  }
}

module.exports = { GenreController };
