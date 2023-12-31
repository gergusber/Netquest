const { query } = require("express");
const express = require("express");
const { body } = require("express-validator");
const {
  getPosts,
  createPost,
  getPost,
  updatePost,
  deletePost } = require("../controllers/feed");
const router = express.Router();

// GET /feed/posts
router.get("/posts", getPosts);

// POST /feed/post
router.post(
  "/post",
  [
    body("title").trim().isLength({ min: 5 }),
    body("img").trim().isLength({ min: 5 }),
  ],
  createPost
);

//GET
router.get("/post/:postId", getPost);

//PUT
router.put(
  "/post/:postId",
  [
    body("title").trim().isLength({ min: 5 }),
    body("img").trim().isLength({ min: 5 }),
  ],
  updatePost
);

//DELETE
router.delete("/post/:postId", deletePost);

module.exports = router;
