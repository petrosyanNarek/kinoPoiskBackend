const { FilmView, Film } = require("../models");
const getIP = require("ipware")().get_ip;
class FilmViewController {
  static async addFilmView(req, res) {
    const { id, ip } = req.headers;
    const { views } = await Film.findOne({ where: { id } });
    const filmView = await FilmView.findOne({
      where: {
        film_id: id,
        view_ip: ip,
      },
    });

    if (!filmView) {
      ("log lll");
      await FilmView.create({
        film_id: id,
        view_ip: ip,
      });
      await Film.update(
        { views: views + 1 },
        {
          where: {
            id,
          },
        }
      );
    } else if (new Date() - filmView.createdAt >= 86400000) {
      await FilmView.update(
        {
          createdAt: new Date(),
        },
        {
          where: {
            id: filmView.id,
          },
        }
      );
      await Film.update(
        { views: views + 1 },
        {
          where: {
            id,
          },
        }
      );
    }
  }
  static async deleteFilmView(filmId) {
    // await FilmView.destroy({ where: { filmId } })
  }
}
module.exports = { FilmViewController };
