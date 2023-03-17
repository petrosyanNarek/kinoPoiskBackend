module.exports = (sequelize, Sequelize) => {
  const Comment = sequelize.define(
    "comments",
    {
      filmId: {
        type: Sequelize.INTEGER,
        allowNull: false,
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
      userName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      userEmail: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      userPhone: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      userMessage: {
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
