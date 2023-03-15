const { ActorFilm } = require("../models")

class ActorFilmController {
    static async newActorFilm(actorFilm) {
        await ActorFilm.create(actorFilm)
    }

    static async deleteActorFilm(filmId) {
        await ActorFilm.destroy({
            where: {
                filmId
            }
        })
    }
}

module.exports = { ActorFilmController }