const express = require("express");

const postsRouter = require("./routers/posts_router");
const commentsRouter = require("./routers/comments_router");

const server = express();

server.use(express.json());
server.use("/api/posts", postsRouter);
server.use("/api/posts", commentsRouter);

server.get("/", (req, res) => {
  res.send(`
  <h2>Posts and Comments API</h2>
  <p>Welcome to the API</p>
    `);
});

module.exports = server;
