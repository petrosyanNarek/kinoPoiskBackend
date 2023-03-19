module.exports = (sequelize, Sequelize) => {
    const CommentRating = sequelize.define(
        "comment_rating",
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
            commentsAnwserId: {
                type: Sequelize.INTEGER,
                references: {
                    model: "commentsAnwsers",
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
            commentRating: {
                type: Sequelize.BOOLEAN,
                allowNull: true,
                defaultValue: null

            }
        },
        {
            freezeTableName: true,
        }
    );
    return CommentRating;
};
