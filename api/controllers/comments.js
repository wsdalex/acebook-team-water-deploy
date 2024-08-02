const Post = require("../models/post");
const { generateToken } = require("../lib/token");

const createComment = async (req, res) => {
    const post = await Post.findById(req.post_id);

    const comment = {user_id: req.user_id, message: req.message}

    post.comments.push(comment)

    await post.save()

    const newToken = generateToken(req.user_id);
    res.status(201).json({ message: "comment created", token: newToken });
}

const CommentController = {
    createComment: createComment
  };

  module.exports = CommentController