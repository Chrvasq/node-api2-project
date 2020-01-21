const express = require("express");
const db = require("../data/db");

const router = express.Router();

// create new post and return new post
router.post("/", (req, res) => {
  const { title, contents } = req.body;

  !title || !contents
    ? res.status(400).json({
        errorMessage: "Please provide title and contents for the post."
      })
    : db
        .insert(req.body)
        .then(postID => {
          db.findById(postID.id)
            .then(post => {
              res.status(201).json(post);
            })
            .catch(() => {
              res.status(500).json({
                message: "The post information could not be retrieved."
              });
            });
        })
        .catch(() => {
          res.status(500).json({
            message: "There was an error while saving the post to the database."
          });
        });
});

// get all posts
router.get("/", (req, res) => {
  db.find()
    .then(posts => {
      res.status(200).json(posts);
    })
    .catch(() => {
      res
        .status(500)
        .json({ error: "The posts information could not be retrieved." });
    });
});

// get post by post ID
router.get("/:id", (req, res) => {
  const { id } = req.params;

  db.findById(id)
    .then(post => {
      post
        ? res.status(200).json(post)
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

// delete post and return deleted post
router.delete("/:id", (req, res) => {
  const { id } = req.params;

  db.findById(id)
    .then(post => {
      post
        ? db
            .remove(id)
            .then(() => {
              res.status(200).json(post);
            })
            .catch(() => {
              res.status(500).json({ error: "The post could not be removed." });
            })
        : res
            .status(404)
            .json({ message: "The post with the specified ID does not exist" });
    })
    .catch(() => {
      res
        .status(500)
        .json({ message: "The post information could not be retrieved." });
    });
});

// update post and return modified post
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { title, contents } = req.body;

  db.findById(id)
    .then(post => {
      // check if post exists
      post
        ? // check for title and contents
          !title || !contents
          ? res.status(400).json({
              errorMessage: "Please provide title and contents for the post."
            })
          : db
              .update(post.id, req.body)
              .then(() => {
                // gets post to return the updated version
                db.findById(post.id)
                  .then(updatedPost => {
                    res.status(200).json(updatedPost);
                  })
                  .catch(() => {
                    res.status(500).json({
                      message:
                        "The updated post information could not be retrieved."
                    });
                  });
              })
              .catch(() => {
                res.status(500).json({
                  error: "The post information could not be modified."
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
