const { Op } = require("sequelize");

module.exports = (
  sortBy,
  sortOrder,
  attributes,
  filterValue,
  includeModels,
  categoryId
) => {
  return {
    order: [[sortBy, sortOrder]],
    where: {
      [Op.or]: attributes.map((attribute) => {
        if (categoryId) {
          return {
            [attribute]: {
              [Op.like]: `%${filterValue}%`,
            },
            categoryId: categoryId,
          };
        }

        return {
          [attribute]: {
            [Op.like]: `%${filterValue}%`,
          },
        };
      }),
    },
    include:
      includeModels &&
      includeModels.map((include) => {
        if (include.ids) {
          return {
            model: include.model,
            required: true,
            where: {
              [Op.or]: include.ids.map((id) => {
                return { id };
              }),
            },
          };
        } else {
          return {
            model: include.model,
            required: true,
          };
        }
      }),
  };
};
