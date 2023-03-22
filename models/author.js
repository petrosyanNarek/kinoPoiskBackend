module.exports = (sequelize, Sequelize) => {
  const Author = sequelize.define(
    "authors",
    {
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      surname: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      info: {
        type: Sequelize.TEXT,
      },
    },
    {
      freezeTableName: true,
    }
  );
  return Author;
};
