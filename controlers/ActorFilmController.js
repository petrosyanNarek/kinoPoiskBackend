const { ActorFilm } = require("../models");

class ActorFilmController {
  static async addFilmActor(filmActor) {
    await ActorFilm.bulkCreate(filmActor);
  }
  static async getAllFilmActor(filmId) {
    return await ActorFilm.findAll({
      where: {
        filmId,
      },
    });
  }
  static async deleteFilmCountries(filmId, actor) {
    await ActorFilm.destroy({
      where: {
        filmId,
        actorId: actor,
      },
    });
  }
  static async updateFilmCountries(filmActor) {
    await ActorFilm.bulkCreate(filmActor, {
      updateOnDuplicate: ["filmId", "actorId"],
    });
  }
}

module.exports = { ActorFilmController };
