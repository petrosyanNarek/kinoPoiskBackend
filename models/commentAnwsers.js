module.exports = (sequelize, Sequelize) => {
    const CommentAnwsers = sequelize.define(
        "commentsAnwsers",
        {
            commentId: {
                type: Sequelize.INTEGER,
                references: {
                    model: "comments",
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
    return CommentAnwsers;
};
