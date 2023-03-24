const { validationResult } = require("express-validator");
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
    return res.status(200).send(category);
  }
  static async addCategory(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).end(errors.array()[0].msg);
      }
      const name = req.body.name;
      await Category.create({ name });
      return res.status(200).send("created");
    } catch (e) {
      return res.status(505).send("Network Error");
    }
  }

  static async deleteCategory(req, res) {
    try {
      const id = req.body.id;
      const deletedItem = await Category.destroy({
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
      return res.status(505).send("Network Error");
    }
  }

  static async updateCategory(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).end(errors.array()[0].msg);
      }
      const { id, name } = req.body;
      await await Category.update(
        {
          name,
        },
        {
          where: {
            id,
          },
        }
      );
      return res.status(200).send("updated");
    } catch {
      return res.status(505).send("Net Work Error");
    }
  }
  static async getFilteredCategories(req, res) {
    try {
      const { page, limit } = pageLimitChek(req.body.page, req.body.limit);
      const sortBy = req.body.sortBy || "createdAt";
      const sortOrder = req.body.sortOrder || "DESC";
      const filterValue = req.body.filterValue || "";
      const attributes = Object.keys(Category.rawAttributes);

      const options = sortBySearchBy(
        sortBy,
        sortOrder,
        attributes,
        filterValue
      );

      const results = await Category.findAll(options);
      let categories = await Category.findAll({
        ...options,
        limit,
        offset: page,
      });
      if (results) {
        return res.status(200).send({
          categories,
          totoalActorsCount: results.length,
          totalPageCount: Math.ceil(results.length / limit),
        });
      } else {
        return res.status(404).send("Not found");
      }
    } catch {
      return res.status(505).send("Network Error");
    }
  }
}

module.exports = { CategoryController };
