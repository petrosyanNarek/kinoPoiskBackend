const { Op } = require("sequelize");
const { AuthorFilm } = require("../models");

class AuthorFilmController {
  static async addFilmCountry(authorFilm) {
    await AuthorFilm.bulkCreate(authorFilm);
  }
  static async getAllAuthorFilm(filmId) {
    return await AuthorFilm.findAll({
      where: {
        filmId,
      },
    });
  }
  static async deleteFilmAuthors(filmId, authors) {
    await AuthorFilm.destroy({
      where: {
        filmId,
        authorId: {
          [Op.ne]: authors,
        },
      },
    });
  }
  static async updateFilmAuthors(authorFilm) {
    await AuthorFilm.bulkCreate(authorFilm, {
      updateOnDuplicate: ["filmId", "authorId"],
    });
  }
}

module.exports = { AuthorFilmController };
