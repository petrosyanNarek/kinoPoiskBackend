module.exports = (sequelize, Sequelize) => {
  const Film = sequelize.define(
    "films",
    {
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      createdYear: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      cardImg: {
        type: Sequelize.STRING,
      },
      rating: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      shortDescription: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      views: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      trailer: {
        type: Sequelize.STRING,
      },
      video: {
        type: Sequelize.STRING,
      },
      categoryId: {
        type: Sequelize.INTEGER,
        references: {
          model: "categories",
          key: "id",
        },
        onDelete: "cascade",
        onUpdate: "cascade",
      },
    },
    {
      freezeTableName: true,
    }
  );
  return Film;
};
