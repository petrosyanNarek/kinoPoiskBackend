const { Comment } = require("../models");

class CommentController {
  static async newComment(req, res) {
    try {
      const { rating, ...comment } = req.body;

      const commentNew = await Comment.create(comment);

      res.status(200).send(commentNew);
    } catch (err) {
      res.status(500).send("err");
    }
  }

  static async deleteComment(req, res) {
    const { id } = req.body;

    await Comment.destroy({
      where: { id },
    });

    res.status(200).send("deleted");
  }

  static async updateComment(req, res) {
    const { id, comment } = req.body;

    await Comment.update(
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
    await Comment.update(
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
}

module.exports = { CommentController };
