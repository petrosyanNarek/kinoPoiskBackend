const { validationResult } = require("express-validator");
const { Op } = require("sequelize");
const { Genre, Film } = require("../models");
const pageLimitChek = require("./hooks/pageLimitChek");
const sortBySearchBy = require("./hooks/sortBySearchBy");
class GenreController {
  static async addGenre(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).end(errors.array()[0].msg);
      }
      const name = req.body.name;
      await Genre.create({ name });
      return res.status(200).send("created");
    } catch (e) {
      return res.status(505).send("Network Error");
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
        return res.status(200).send("deleted");
      } else {
        return res.status(404).send("Not found");
      }
    } catch {
      return res.status(505).send("Network Error");
    }
  }
  static async updateGenre(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).end(errors.array()[0].msg);
      }
      const { id, name } = req.body;
      await Genre.update(
        {
          name,
        },
        {
          where: {
            id,
          },
        }
      );
      return res.status(200).send("updated");
    } catch {
      return res.status(505).send("Net Work Error");
    }
  }
  static async getAllGenre(req, res) {
    try {
      const allGenre = await Genre.findAll();
      return res.status(200).send(allGenre);
    } catch {
      return res.status(404);
    }
  }
  static async getGenreById(req, res) {
    try {
      const { id } = req.headers;
      const genre = await Genre.findOne({
        where: {
          id,
        },
      });
      return res.status(200).send(genre);
    } catch {
      return res.status(500).send("Network Error");
    }
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
    return res.status(200).send({
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

    return res.status(200).send(genresFilm);
  }
}

module.exports = { GenreController };
