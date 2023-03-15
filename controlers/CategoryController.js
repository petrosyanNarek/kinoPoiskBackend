const { Category } = require("../models");
const pageLimitChek = require("./hooks/pageLimitChek");
const sortBySearchBy = require("./hooks/sortBySearchBy");

class CategoryController {
  static async getAllCategory(req, res) {
    const categories = await Category.findAll();

    res.status(200).send(categories);
  }
  static async getCategoryById(req, res) {
    const { id } = req.headers;
    const category = await Category.findOne({ where: { id } });
    res.status(200).send(category);
  }
  static async addCategory(req, res) {
    const { category } = req.body;

    await Category.create(category);
    res.status(200).send("created");
  }

  static async deleteCategory(req, res) {
    const { id } = req.body;

    await Category.destroy({
      where: {
        id,
      },
    });
    res.status(200).send({ mes: "deleted" });
  }

  static async updateCategory(req, res) {
    const { id, category } = req.body;
    await Category.update(category, {
      where: {
        id,
      },
    });

    res.status(200).send("updated");
  }
  static async getFilteredCategories(req, res) {
    const { page, limit } = pageLimitChek(req.body.page, req.body.limit);
    const sortBy = req.body.sortBy || "createdAt";
    const sortOrder = req.body.sortOrder || "DESC";
    const filterValue = req.body.filterValue || "";
    const attributes = Object.keys(Category.rawAttributes);

    const options = sortBySearchBy(sortBy, sortOrder, attributes, filterValue);

    const results = await Category.findAll(options);
    let categories = await Category.findAll({
      ...options,
      limit,
      offset: page,
    });
    res.status(200).send({
      categories,
      totoalActorsCount: results.length,
      totalPageCount: Math.ceil(results.length / limit),
    });
  }
}

module.exports = { CategoryController };
