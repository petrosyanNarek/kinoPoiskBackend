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
      img: {
        type: Sequelize.STRING,
      },
    },
    {
      freezeTableName: true,
    }
  );
  return Author;
};
