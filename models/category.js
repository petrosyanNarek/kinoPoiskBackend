module.exports = (sequelize, Sequelize) => {
  const Category = sequelize.define(
    "categories",
    {
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
    },
    {
      freezeTableName: true,
    }
  );
  return Category;
};
