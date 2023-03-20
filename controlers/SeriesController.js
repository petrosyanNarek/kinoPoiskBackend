const {
  Series,
  Comment,
  User,
  CommentRating,
  CommentAnwsers,
} = require("../models");
const commentAnwsers = require("../models/commentAnwsers");
const pageLimitChek = require("./hooks/pageLimitChek");
const sortBySearchBy = require("./hooks/sortBySearchBy");

class SeriesController {
  static async addSeries(req, res) {
    const { ...series } = req.body;
    try {
      const cardImg = `http://localhost:3000/${req.files.cardImg[0].path}`;
      const trailer = `http://localhost:3000/${req.files.trailer[0].path}`;
      const video = `http://localhost:3000/${req.files.video[0].path}`;
      await Series.create({ ...series, cardImg, trailer, video });
      res.status(200).send("created");
    } catch (err) {
      res.status(500).send("Error 500");
    }
  }

  static async deleteSeries(req, res) {
    const { id } = req.body;

    await Series.destroy({
      where: {
        id,
      },
    });
    res.status(200).send("deleted");
  }
  static async updateSeriesRating(req, res) {
    const { id, rating } = req.body;
    await Series.update(
      {
        rating,
      },
      {
        where: {
          id,
        },
      }
    );
    res.status(200);
  }
  static async updateSeries(req, res) {
    console.log("up");
    let { id, ...seria } = req.body;
    let cardImg, trailer, video;
    if (req.files.cardImg) {
      cardImg = `http://localhost:3000/${req.files.cardImg[0].path}`;
    }

    if (req.files.trailer) {
      trailer = `http://localhost:3000/${req.files.trailer[0].path}`;
    }
    if (req.files.video) {
      video = `http://localhost:3000/${req.files.video[0].path}`;
    }
    const getSeries = await Series.findOne({ where: { id: +id[0] } });
    if (cardImg) {
      const cardImgPath = getSeries.cardImg.split("\\");
      fs.unlink(
        process.cwd() + "/public/images/" + cardImgPath[cardImgPath.length - 1],
        (err) => {
          if (err) {
            return new Error(err);
          }
        }
      );
    }
    if (trailer) {
      const trailerPath = getSeries.trailer.split("\\");
      fs.unlink(
        process.cwd() + "/public/video/" + trailerPath[trailerPath.length - 1],
        (err) => {
          if (err) {
            return new Error(err);
          }
        }
      );
    }
    if (video) {
      const videoPath = getSeries.video.split("\\");
      fs.unlink(
        process.cwd() + "/public/video/" + videoPath[videoPath.length - 1],
        (err) => {
          if (err) {
            return new Error(err);
          }
        }
      );
    }

    seria = Object.fromEntries(
      Object.entries(seria).filter(([_, v]) => v != "")
    );
    const updateSeria = await Series.update(
      {
        ...seria,
        cardImg,
        trailer,
        video,
      },
      {
        where: {
          id,
        },
      }
    );

    res.status(200).send(updateSeria);
  }

  static async getSeriesByFilmId(req, res) {
    const { filmId } = req.body;
    const { page, limit } = pageLimitChek(req.headers.page, req.headers.limit);
    const series = await Series.findAll({
      where: {
        filmId,
      },
    });
    const filmSeries = await Series.findAll({
      where: {
        filmId,
      },
      limit,
      offset: page,
    });
    res.status(200).send({
      films: filmSeries,
      totoalFilmCount: series.length,
      totalPageCount: Math.ceil(series.length / limit),
    });
  }

  static async getSeries(req, res) {
    const { page, limit } = pageLimitChek(req.headers.page, req.headers.limit);
    const series = await Series.findAll();
    const filmSeries = await Series.findAll({
      limit,
      offset: page,
    });
    res.status(200).send({
      series: filmSeries,
      totoalFilmCount: series.length,
      totalPageCount: Math.ceil(series.length / limit),
    });
  }

  static async getSeriesById(req, res) {
    const { id } = req.headers;

    const series = await Series.findOne({
      where: {
        id,
      },
      include: [
        {
          model: Comment,
          attributes: [
            "id",
            "message",
            "commentLike",
            "commentDisLike",
            "createdAt",
          ],
          include: [
            {
              model: User,
              attributes: ["fullName", "id"],
            },
            {
              model: CommentRating,
              include: [
                {
                  model: User,
                  attributes: ["fullName", "id"],
                },
              ],
            },
            {
              model: CommentAnwsers,
              include: [
                {
                  model: User,
                  attributes: ["fullName", "id"],
                },
                {
                  model: CommentRating,
                  include: [
                    {
                      model: User,
                      attributes: ["fullName", "id"],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    });
    console.log(id);
    res.status(200).send(series);
  }
  static async sortAndFilteresSeries(req, res) {
    const { page, limit } = pageLimitChek(req.body.page, req.body.limit);
    const sortBy = req.body.sortBy || "createdAt";
    const sortOrder = req.body.sortOrder || "DESC";
    const filterValue = req.body.filterValue || "";
    const attributes = Object.keys(Series.rawAttributes);

    const options = sortBySearchBy(sortBy, sortOrder, attributes, filterValue);
    const results = await Series.findAll(options);
    let series = await Series.findAll({
      ...options,
      limit,
      offset: page,
    });
    res.status(200).send({
      series,
      totoalSeriesCount: results.length,
      totalPageCount: Math.ceil(results.length / limit),
    });
  }
}

module.exports = { SeriesController };
