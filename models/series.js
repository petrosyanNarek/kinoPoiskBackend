module.exports = (sequelize, Sequelize) => {
    const Series = sequelize.define('series', {
        name: {
            type: Sequelize.STRING,
            allowNull: false
        },
        filmId: {
            type: Sequelize.INTEGER,
            references: {
                model: 'films',
                key: 'id'
            },
            onDelete: 'cascade',
            onUpdate: 'cascade'
        },
        cardImg: {
            type: Sequelize.STRING,
        },
        sliderImg: {
            type: Sequelize.STRING,
        },
        trailer: {
            type: Sequelize.STRING,
        },
        video: {
            type: Sequelize.STRING,
        },
        rating: {
            type: Sequelize.FLOAT,
        },
        description: {
            type: Sequelize.TEXT,
            allowNull: false
        },
        shortDescription: {
            type: Sequelize.TEXT,
            allowNull: false
        },
        views: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        part: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        sezon: {
            type: Sequelize.INTEGER,
            allowNull: false
        }
    }, {
        freezeTableName: true,
    })
    return Series
}