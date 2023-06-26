const { validationResult } = require("express-validator");
const Post = require("../models/post");

exports.getPosts = async (req, res, next) => {
  try {
    const totalItems = await Post.find().countDocuments();
    const posts = await Post.find().sort({ createdAt: -1 });
    const showPosts = posts.map(post => {
      return {
        id: post._id,
        title: post.title,
        imageUrl: post.imageUrl,
        createdAt: post.createdAt,
      };
    })
    res.status(200).json({
      totalItems: totalItems,
      posts: showPosts,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.createPost = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("validation Failed, enter data is incorrect");
    error.statusCode = 422;
    throw error;
  }

  if (!req.body.img) {
    const error = new Error("No image provided");
    error.statusCode = 422;
    throw error;
  }

  const title = req.body.title;
  const post = new Post({
    title: title,
    imageUrl: req.body.img,
  });

  try {
    const savedPost = await post.save();
    res.status(201).json({
      message: "Post created successfully!",
      post: {
        id: savedPost._id,
        title: savedPost.title,
        imageUrl: savedPost.imageUrl,
      }
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getPost = async (req, res, next) => {
  const postId = req.params.postId;
  try {
    const post = await Post.findById(postId);
    if (!post) {
      const err = new Error("Could not found post");
      err.statusCode = 422;
      throw err;
    }

    res.status(200).json({
      post: {
        id: post._id,
        title: post.title,
        imageUrl: post.imageUrl,
        createdAt: post.createdAt,
      }
    });

  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.updatePost = async (req, res, next) => {
  const postId = req.params.postId;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed, entered data is incorrect.");
    error.statusCode = 422;
    throw error;
  }
  const title = req.body.title;
  let imageUrl = req.body.img;

  if (!imageUrl) {
    const error = new Error("no File picked");
    error.statusCode = 422;
    throw error;
  }

  try {
    const post = await Post.findById(postId);
    if (!post) {
      const err = new Error("Could not find post");
      err.statusCode = 404;
      throw err;
    }

    post.title = title;
    post.imageUrl = imageUrl;
    const result = await post.save();
    res.status(200).json({
      post: {
        id: post._id,
        title: result.title,
        imageUrl: result.imageUrl,
        createdAt: result.createdAt,
        updatedAt: result.updatedAt,
      }
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.deletePost = async (req, res, next) => {
  const postId = req.params.postId;

  try {
    const post = await Post.findById(postId);

    if (!post) {
      const err = new Error("Could not find post");
      err.statusCode = 404;
      throw err;
    }

    await Post.findByIdAndRemove(postId);

    res.status(200).json({ message: "Delete Post succeeds" });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
