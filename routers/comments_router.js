const express = require("express");
const db = require("../data/db");

const router = express.Router();

// GET all comments by post ID
router.get("/:id/comments", (req, res) => {
  const { id } = req.params;

  db.findById(id)
    .then(post => {
      // check if post exists
      post
        ? db
            .findPostComments(post.id)
            .then(comments => {
              res.status(200).json(comments);
            })
            .catch(() => {
              res.status(500).json({
                message: "The comments information could not be retrieved."
              });
            })
        : res.status(404).json({
            message: "The post with the specified ID does not exist."
          });
    })
    .catch(() => {
      res
        .status(500)
        .json({ message: "The post information could not be retrived." });
    });
});

// create new comment on post
router.post("/:id/comments", (req, res) => {
  const { id } = req.params;
  const { text } = req.body;

  const comment = { text: text, post_id: id };

  db.findById(id)
    .then(post => {
      // check if post exists
      post
        ? // check if text property exists
          !text
          ? res
              .status(400)
              .json({ errorMessage: "Please provide text for the comment." })
          : db
              .insertComment(comment)
              .then(commentID => {
                // get newly created comment and return comment
                db.findCommentById(commentID.id)
                  .then(comment => {
                    res.status(201).json(comment);
                  })
                  .catch(() => {
                    res.status(500).json({
                      message: "The comment info could not be retrieved."
                    });
                  });
              })
              .catch(() => {
                res.status(500).json({
                  message:
                    "There was an error while saving the comment to the database."
                });
              })
        : res.status(404).json({
            message: "The post with the specified ID does not exist."
          });
    })
    .catch(() => {
      res
        .status(500)
        .json({ message: "The post information could not be retrieved." });
    });
});

module.exports = router;
