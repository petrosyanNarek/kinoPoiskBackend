const { validationResult } = require("express-validator");
const { Actor } = require("../models");
const pageLimitChek = require("./hooks/pageLimitChek");
const sortBySearchBy = require("./hooks/sortBySearchBy");

class ActorController {
  static async getAllActors(req, res) {
    const actors = await Actor.findAll();

    return res.status(200).send(actors);
  }

  static async addActor(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).end(errors.array()[0].msg);
      }
      const { ...actor } = req.body;
      await Actor.create(actor);
      return res.status(200).send("added");
    } catch {
      return res.status(500).send("Network Error");
    }
  }

  static async deleteActor(req, res) {
    try {
      const { id } = req.body;

      const deletedItem = await Actor.destroy({
        where: {
          id,
        },
      });

      if (deletedItem) {
        return res.status(200).send("deleted");
      } else {
        return res.status(404).send("Not found");
      }
    } catch {
      return res.status(500).send("Network Error");
    }
  }

  static async updateActor(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).end(errors.array()[0].msg);
      }
      const { id, ...actor } = req.body;

      await Actor.update(actor, {
        where: {
          id,
        },
      });

      return res.status(200).send("updated");
    } catch {
      return res.status(404).send("Not Found");
    }
  }

  static async getActorById(req, res) {
    try {
      const { id } = req.headers;

      const author = await Actor.findOne({
        where: {
          id,
        },
      });

      return res.status(200).send(author);
    } catch {
      return res.status(500).send("Network Error");
    }
  }
  static async getFilteredActor(req, res) {
    try {
      const { page, limit } = pageLimitChek(req.body.page, req.body.limit);
      const sortBy = req.body.sortBy || "createdAt";
      const sortOrder = req.body.sortOrder || "DESC";
      const filterValue = req.body.filterValue || "";
      const attributes = Object.keys(Actor.rawAttributes);

      const options = sortBySearchBy(
        sortBy,
        sortOrder,
        attributes,
        filterValue
      );

      const results = await Actor.findAll(options);
      let actors = await Actor.findAll({
        ...options,
        limit,
        offset: page,
      });
      return res.status(200).send({
        actors,
        totoalActorsCount: results.length,
        totalPageCount: Math.ceil(results.length / limit),
      });
    } catch {
      return res.status(500).send("Networ Error");
    }
  }
}

module.exports = { ActorController };
