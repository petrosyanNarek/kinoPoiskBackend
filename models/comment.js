module.exports = (sequelize, Sequelize) => {
    const Comment = sequelize.define('comments', {
        filmId: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: 'films',
                key: 'id'
            },
            onDelete: 'cascade',
            onUpdate: 'cascade'
        },
        seriesId: {
            type: Sequelize.INTEGER,
            references: {
                model: 'series',
                key: 'id'
            },
            onDelete: 'cascade',
            onUpdate: 'cascade'
        },
        description: {
            type: Sequelize.STRING,
            allowNull: false
        }
    }, {
        freezeTableName: true,
    })
    return Comment
}