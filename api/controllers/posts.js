const Post = require("../models/post");
const { generateToken } = require("../lib/token");

const getAllPosts = async (req, res) => {
  const posts = await Post.find().populate("user_id", "name email");
  const token = generateToken(req.user_id);
  res.status(200).json({ posts: posts, token: token });
};

const createPost = async (req, res) => {
  const post = new Post({
    ...req.body, // spread operator works as like a copy and paste to copy the req.body and add in the user_id below
    user_id: req.user_id, // must be same as what its in post
  });
  await post.save();

  const newToken = generateToken(req.user_id);
  res.status(201).json({ message: "Post created", token: newToken });
};

const getUserPosts = async (req, res) => {
  try {
    const posts = await Post.find({ user_id: req.user_id }).populate("user_id", "name email");
    res.status(200).json({posts: posts});
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error fetching the user's posts"})
  }
};

const PostsController = {
  getAllPosts: getAllPosts,
  createPost: createPost,
  getUserPosts: getUserPosts,
};

module.exports = PostsController;
