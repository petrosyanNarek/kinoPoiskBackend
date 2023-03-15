const { FilmGenre } = require('../models')
class FilmGenreController {
    static async addFilmGenre(filmGenre) {
        await FilmGenre.create(filmGenre)
    }
    static async deleteFilmGenre(filmId) {
        await FilmGenre.destroy({ where: { filmId } })
    }


}
module.exports = { FilmGenreController }