const { Comment } = require("../models/comment.model");

const createComment = async (req, res) => {
  try {
    const newComment = new Comment(req.body);
    await newComment.save();
    console.log(
      `createComment - returning newComment: ${JSON.stringify(newComment)}`
    );
    res.status(201).json(newComment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllComments = async (req, res) => {
  try {
    const comments = await Comment.find().populate("comments");
    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createComment,
  getAllComments,
};
