module.exports = (sequelize, Sequelize) => {
  const FilmView = sequelize.define(
    "film_view",
    {
      film_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      view_ip: {
        type: Sequelize.STRING,
        allowNull: false,
      },
    },
    {
      freezeTableName: true,
    }
  );
  return FilmView;
};
