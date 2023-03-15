
module.exports = (sequelize, Sequelize) => {
    const FilmGenre = sequelize.define('films_genres', {
        filmId: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        genreId: {
            type: Sequelize.INTEGER,
            allowNull: false
        }
    }, {
        freezeTableName: true,
        timestamps: false,
    })
    return FilmGenre
}