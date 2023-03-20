const { FilmView, Film, Series } = require("../models");
class FilmViewController {
  static async addFilmView(req, res) {
    const { film_id, ip, serial_id } = req.headers;
    console.log(film_id, ip, serial_id);
    if (film_id) {
      const { views } = await Film.findOne({ where: { id: film_id } });
      const filmView = await FilmView.findOne({
        where: {
          film_id,
          view_ip: ip,
        },
      });
      if (!filmView) {
        await FilmView.create({
          film_id,
          view_ip: ip,
        });
        await Film.update(
          { views: views + 1 },
          {
            where: {
              id: film_id,
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
              id: film_id,
            },
          }
        );
      }
    } else {
      const { views } = await Series.findOne({ where: { id: serial_id } });
      const filmView = await FilmView.findOne({
        where: {
          serial_id,
          view_ip: ip,
        },
      });

      if (!filmView) {
        await FilmView.create({
          serial_id,
          view_ip: ip,
        });
        await Series.update(
          { views: views + 1 },
          {
            where: {
              id: serial_id,
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
        await Series.update(
          { views: views + 1 },
          {
            where: {
              id: serial_id,
            },
          }
        );
      }
    }
    res.status(200);
  }
  static async deleteFilmView(filmId) {
    // await FilmView.destroy({ where: { filmId } })
  }
}
module.exports = { FilmViewController };
