const { validationResult } = require("express-validator");
const { Author } = require("../models");
const pageLimitChek = require("./hooks/pageLimitChek");
const sortBySearchBy = require("./hooks/sortBySearchBy");

class AuthorController {
  static async getAllAuthor(req, res) {
    try {
      const authors = await Author.findAll();
      return res.status(200).send(authors);
    } catch {
      return res.status(500).send("Network error");
    }
  }
  static async addAuthor(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).end(errors.array()[0].msg);
      }
      const { ...author } = req.body;
      await Author.create(author);
      return res.status(200).send("added");
    } catch {
      return res.status(500).send("Network Error");
    }
  }
  static async deleteAuthor(req, res) {
    try {
      const { id } = req.body;
      const deletedItem = await Author.destroy({
        where: { id },
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
  static async updateAuthor(req, res) {
    res.status(200).send("updated");
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).end(errors.array()[0].msg);
      }
      const { id, ...author } = req.body;

      await Author.update(author, {
        where: {
          id,
        },
      });

      return res.status(200).send("updated");
    } catch {
      return res.status(500).send("Network Error");
    }
  }

  static async getAuthorById(req, res) {
    try {
      const { id } = req.headers;

      const author = await Author.findOne({
        where: {
          id,
        },
      });

      return res.status(200).send(author);
    } catch {
      return res.status(500).send("Network Error");
    }
  }
  static async getFilteredAuthor(req, res) {
    try {
      const { page, limit } = pageLimitChek(req.body.page, req.body.limit);
      const sortBy = req.body.sortBy || "createdAt";
      const sortOrder = req.body.sortOrder || "DESC";
      const filterValue = req.body.filterValue || "";
      const attributes = Object.keys(Author.rawAttributes);

      const options = sortBySearchBy(
        sortBy,
        sortOrder,
        attributes,
        filterValue
      );

      const results = await Author.findAll(options);
      let authors = await Author.findAll({
        ...options,
        limit,
        offset: page,
      });
      res.status(200).send({
        authors,
        totoalActorsCount: results.length,
        totalPageCount: Math.ceil(results.length / limit),
      });
    } catch {
      return res.status(500).send("Network Error");
    }
  }
}

module.exports = { AuthorController };
