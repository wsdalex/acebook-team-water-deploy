const Post = require("../models/post");
const { generateToken } = require("../lib/token");

const createComment = async (req, res) => {
  const post = await Post.findById(req.body.post_id);

  const comment = { comment: req.body.comment, user_id: req.user_id };

  console.log(post);
  post.comments.push(comment);

  await post.save();

  const newToken = generateToken(req.user_id);
  res.status(201).json({ message: "comment created", token: newToken });
};

// const getCommentsByPostId = async (req, res) => {
//     const postId = req.params.post_id; //body or params?
//     const post = await Post.findById(postId).populate('comments.user_id', 'name');
//     if (!post) {
//       return res.status(404).json({ message: "Post not found" });
//     }
//     res.status(200).json(post.comments);
//   };
  

const CommentController = {
  createComment: createComment,

};

module.exports = CommentController;
