const { CommentAnwsers, CommentRating } = require("../models");

class CommentAnwserController {
    static async newComment(req, res) {
        try {
            const { comment } = req.body;

            await CommentAnwsers.create(comment);

            res.status(200).send("created");
        } catch (err) {
            res.status(500).send("err");
        }
    }

    static async deleteComment(req, res) {
        const { id } = req.body;

        await CommentAnwsers.destroy({
            where: { id },
        });

        res.status(200).send("deleted");
    }

    static async updateComment(req, res) {
        const { id, comment } = req.body;

        await CommentAnwsers.update(
            {
                ...comment,
            },
            {
                where: {
                    id,
                },
            }
        );

        res.status(200).send("updated");
    }

    static async updateCommentRating(commentRating, id) {

        await CommentAnwsers.update(
            {
                ...commentRating,
            },
            {
                where: {
                    id,
                },
            }
        );

    }

    static async getCommentAnwser(req, res) {
        const a = await CommentAnwsers.findAll({
            include: [
                {
                    model: CommentRating,
                },
            ]
        })
        res.send(a)
    }

}

module.exports = { CommentAnwserController };
