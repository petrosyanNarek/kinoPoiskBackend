const { Country, Film } = require("../models");
const pageLimitChek = require("./hooks/pageLimitChek");
const sortBySearchBy = require("./hooks/sortBySearchBy");
class CountryController {
  static async addCountry(req, res) {
    const { country } = req.body;
    await Country.create(country);
    res.status(200).send("created");
  }
  static async deleteCountry(req, res) {
    const { id } = req.body;
    const deletedCountry = await Country.destroy({
      where: {
        id,
      },
    });
    if (deletedCountry) {
      res.status(200).send("deleted");
    } else {
      res.status(404).send("Not found");
    }
  }
  static async updateCountry(req, res) {
    const { id, country } = req.body;
    await Country.update(
      {
        ...country,
      },
      {
        where: {
          id,
        },
      }
    );

    res.status(200).send("updated");
  }
  static async getAllCountry(req, res) {
    const allCountry = await Country.findAll();

    res.status(200).send(allCountry);
  }

  static async getCountryById(req, res) {
    const { id } = req.headers;

    const country = await Country.findOne({
      where: {
        id,
      },
    });
    res.status(200).send(country);
  }

  static async getFilteredCountries(req, res) {
    const { page, limit } = pageLimitChek(req.body.page, req.body.limit);
    const sortBy = req.body.sortBy || "createdAt";
    const sortOrder = req.body.sortOrder || "DESC";
    const filterValue = req.body.filterValue || "";
    const attributes = Object.keys(Country.rawAttributes);

    const options = sortBySearchBy(sortBy, sortOrder, attributes, filterValue);

    const results = await Country.findAll(options);
    let countries = await Country.findAll({
      ...options,
      limit,
      offset: page,
    });
    res.status(200).send({
      countries,
      totoalActorsCount: results.length,
      totalPageCount: Math.ceil(results.length / limit),
    });
  }
}

module.exports = { CountryController };
