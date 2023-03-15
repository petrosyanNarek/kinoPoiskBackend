module.exports = (sequelize, Sequelize) => {
  const ActorFilm = sequelize.define(
    "actors_films",
    {
      filmId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      actorId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
    },
    {
      freezeTableName: true,
    }
  );
  return ActorFilm;
};
