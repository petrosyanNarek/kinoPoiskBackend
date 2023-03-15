const { AuthorFilm } = require("../models");

class AuthorFilmController {
    static async newAuthorFilm(authorFilm) {
        await AuthorFilm.create(authorFilm)
    }

    static async deleteAuthorFilm(filmId) {
        await AuthorFilm.destroy({
            where: {
                filmId
            }
        })
    }
}

module.exports = { AuthorFilmController }