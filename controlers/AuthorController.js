const { Author } = require("../models");
const pageLimitChek = require("./hooks/pageLimitChek");
const sortBySearchBy = require("./hooks/sortBySearchBy");

class AuthorController {
  static async getAllAuthor(req, res) {
    const authors = await Author.findAll();
    res.status(200).send(authors);
  }
  static async addAuthor(req, res) {
    const { author } = req.body;
    await Author.create(author);
    res.status(200).send("created");
  }
  static async deleteAuthor(req, res) {
    const { id } = req.body;
    await Author.destroy({
      where: { id },
    });

    res.status(200).send("deleted");
  }
  static async updateAuthor(req, res) {
    const { id, author } = req.body;

    await Author.update(
      {
        ...author,
      },
      {
        where: {
          id,
        },
      }
    );

    res.status(200).send("updated");
  }

  static async getAuthorById(req, res) {
    const { id } = req.headers;

    const author = await Author.findOne({
      where: {
        id,
      },
    });

    res.status(200).send(author);
  }
  static async getFilteredAuthor(req, res) {
    const { page, limit } = pageLimitChek(req.body.page, req.body.limit);
    const sortBy = req.body.sortBy || "createdAt";
    const sortOrder = req.body.sortOrder || "DESC";
    const filterValue = req.body.filterValue || "";
    const attributes = Object.keys(Author.rawAttributes);

    const options = sortBySearchBy(sortBy, sortOrder, attributes, filterValue);

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
  }
}

module.exports = { AuthorController };
