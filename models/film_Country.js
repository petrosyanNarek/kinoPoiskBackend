module.exports = (sequelize, Sequelize) => {
    const FilmCountry = sequelize.define('films_countrys', {
        filmId: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        countryId: {
            type: Sequelize.INTEGER,
            allowNull: false
        }
    }, {
        freezeTableName: true,
        timestamps: false,
    })
    return FilmCountry
}