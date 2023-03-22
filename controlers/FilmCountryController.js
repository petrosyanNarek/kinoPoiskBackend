const { FilmCountry } = require("../models");
class FilmCountryController {
  static async addFilmCountry(filmCountry) {
    await FilmCountry.bulkCreate(filmCountry);
  }
  static async getAllFilmCountry(filmId) {
    return await FilmCountry.findAll({
      where: {
        filmId,
      },
    });
  }
  static async deleteFilmCountries(filmId, country) {
    await FilmCountry.destroy({
      where: {
        filmId,
        countryId: country,
      },
    });
  }
  static async updateFilmCountries(filmCountry) {
    await FilmCountry.bulkCreate(filmCountry, {
      updateOnDuplicate: ["filmId", "countryId"],
    });
  }
}

module.exports = { FilmCountryController };
