module.exports = (sequelize, Sequelize) => {
  const Comment = sequelize.define(
    "comments",
    {
      filmId: {
        type: Sequelize.INTEGER,
        references: {
          model: "films",
          key: "id",
        },
        onDelete: "cascade",
        onUpdate: "cascade",
      },
      seriesId: {
        type: Sequelize.INTEGER,
        references: {
          model: "series",
          key: "id",
        },
        onDelete: "cascade",
        onUpdate: "cascade",
      },
      userId: {
        type: Sequelize.INTEGER,
        references: {
          model: "users",
          key: "id",
        },
        onDelete: "cascade",
        onUpdate: "cascade",
      },
      message: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      commentLike: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      commentDisLike: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
    },
    {
      freezeTableName: true,
    }
  );
  return Comment;
};
