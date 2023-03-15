module.exports = (sequelize, Sequelize) => {
  const AuthorFilm = sequelize.define(
    "authors_films",
    {
      filmId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      authorId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
    },
    {
      freezeTableName: true,
    }
  );
  return AuthorFilm;
};
