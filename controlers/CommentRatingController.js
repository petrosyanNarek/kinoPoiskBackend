const { CommentRating, Comment, CommentAnwsers } = require("../models");
const { CommentAnwserController } = require("./CommentAnwser");
const { CommentController } = require("./CommentController");
class CommentRatingController {
    static async addCommentRating(req, res) {
        const { user_id, comment_id, rating, coment_anwser_id } = req.body
        const commentRating = comment_id ? await CommentRating.findOne({
            where: {
                commentId: comment_id,
                userId: user_id
            }
        }) : await CommentRating.findOne({
            where: {
                commentsAnwserId: coment_anwser_id,
                userId: user_id
            }
        })
        if (comment_id) {
            const comment = await Comment.findOne({
                where: {
                    id: comment_id
                }
            })

            if (commentRating) {
                if (commentRating.commentRating === rating) {
                    await CommentRating.destroy({
                        where: {
                            id: commentRating.id
                        },
                    });
                    if (rating) {
                        CommentController.updateCommentRating({ commentLike: comment.commentLike - 1 }, comment_id)
                    } else {
                        CommentController.updateCommentRating({ commentDisLike: comment.commentDisLike - 1 }, comment_id)
                    }
                } else {
                    await CommentRating.update(
                        { commentRating: rating },
                        {
                            where: {
                                id: commentRating.id,
                            },
                        }
                    );
                    if (rating) {
                        CommentController.updateCommentRating({ commentLike: comment.commentLike + 1, commentDisLike: comment.commentDisLike - 1 }, comment_id)
                    } else {
                        CommentController.updateCommentRating({ commentLike: comment.commentLike - 1, commentDisLike: comment.commentDisLike + 1 }, comment_id)
                    }
                }
            } else {
                await CommentRating.create(
                    {
                        commentRating: rating,
                        commentId: comment_id,
                        userId: user_id
                    }
                );
                if (rating) {
                    CommentController.updateCommentRating({ commentLike: comment.commentLike + 1 }, comment_id)
                } else {
                    CommentController.updateCommentRating({ commentDisLike: comment.commentDisLike + 1 }, comment_id)
                }
            }
        } else {
            const commentanwser = await CommentAnwsers.findOne({
                where: {
                    id: coment_anwser_id
                }
            })
            if (commentRating) {
                if (commentRating.commentRating === rating) {
                    await CommentRating.destroy({
                        where: {
                            id: commentRating.id
                        },
                    });
                    if (rating) {
                        CommentAnwserController.updateCommentRating({ commentLike: commentanwser.commentLike - 1 }, coment_anwser_id)
                    } else {
                        CommentAnwserController.updateCommentRating({ commentDisLike: commentanwser.commentDisLike - 1 }, coment_anwser_id)
                    }
                } else {
                    await CommentRating.update(
                        { commentRating: rating },
                        {
                            where: {
                                id: commentRating.id,
                            },
                        }
                    );
                    if (rating) {
                        CommentAnwserController.updateCommentRating({ commentLike: commentanwser.commentLike + 1, commentDisLike: commentanwser.commentDisLike - 1 }, coment_anwser_id)
                    } else {
                        CommentAnwserController.updateCommentRating({ commentLike: commentanwser.commentLike - 1, commentDisLike: commentanwser.commentDisLike + 1 }, coment_anwser_id)
                    }
                }
            } else {
                await CommentRating.create(
                    {
                        commentRating: rating,
                        commentsAnwserId: coment_anwser_id,
                        userId: user_id
                    }
                );
                if (rating) {
                    CommentAnwserController.updateCommentRating({ commentLike: commentanwser.commentLike + 1 }, coment_anwser_id)
                } else {
                    CommentAnwserController.updateCommentRating({ commentDisLike: commentanwser.commentDisLike + 1 }, coment_anwser_id)
                }
            }
        }
        res.send("done")
    }
}
module.exports = { CommentRatingController };
