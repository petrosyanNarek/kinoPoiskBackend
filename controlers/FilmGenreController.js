const { Op } = require("sequelize");
const { FilmGenre } = require("../models");
class FilmGenreController {
  static async addFilmGenre(filmGenre) {
    await FilmGenre.bulkCreate(filmGenre);
  }
  static async getAllFilmGenre(filmId) {
    return await FilmGenre.findAll({
      where: {
        filmId,
      },
    });
  }
  static async deleteFilmGenres(filmId, genres) {
    await FilmGenre.destroy({
      where: {
        filmId,
        genreId: genres,
      },
    });
  }
  static async updateFilmGenres(filmGenre) {
    await FilmGenre.bulkCreate(filmGenre, {
      updateOnDuplicate: ["filmId", "genreId"],
    });
  }
}
module.exports = { FilmGenreController };
