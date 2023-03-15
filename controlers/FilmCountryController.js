const { FilmCountry } = require('../models')
class FilmCountryController {
    static async addFilmCountry(filmCountry) {
        await FilmCountry.create(filmCountry)
    }

    static async deleteFilmCountry(filmId) {
        await FilmCountry.destroy({ where: { filmId } })
    }
    static async updateFilmCountry(filmCountry) {
        console.log(filmCountry);
        await FilmCountry.update(filmCountry,
            {
                where: {
                    filmId: filmCountry.filmId
                }
            })
    }
}

module.exports = { FilmCountryController }