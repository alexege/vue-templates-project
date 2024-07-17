const { Comment } = require("../models/comment.model");

const createComment = async (req, res) => {
  try {
    const newComment = new Comment(req.body);
    await newComment.save();
    // console.log(
    //   `createComment - returning newComment: ${JSON.stringify(newComment)}`
    // );
    res.status(201).json(newComment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllComments = async (req, res) => {
  try {
    const comments = await Comment.find().populate("comments");

    //Attempt to populate all comments for each Comment recursively
    for (const comment of comments) {
      await populateAllChildComments(comment);
    }

    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const populateAllChildComments = async (comment) => {
  await Comment.populate(comment, [{ path: "comments" }, { path: "author" }]);

  //Recursively populate each Comment's comments
  if (comment.comments && comment.comments.length > 0) {
    for (let i = 0; i < comment.comments.length; i++) {
      comment.comments[i] = await populateAllChildComments(comment.comments[i]);
    }
  }
  return comment;
};

const deleteCommentById = async (req, res) => {
  const commentId = req.params.id;
  try {
    //Find Comment by Id and Delete
    const deletedComment = await Comment.findByIdAndDelete(commentId);

    if (!deletedComment) {
      return res.status(404).json({ error: "Comment not found" });
    }

    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addCommentToComment = async (req, res) => {
  const parentCommentId = req.params.id;
  try {
    //Create new Comment
    const newComment = new Comment(req.body);
    await newComment.save();

    //Find parent Comment
    const parentComment = await Comment.findById(parentCommentId);
    if (parentComment) {
      parentComment.comments.push(newComment);
    }
    await parentComment.save();

    res.status(201).json(newComment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getCommentById = async (req, res) => {
  const commentId = req.params.id;
  try {
    const foundComment = await Comment.findById(commentId);

    if (!foundComment) {
      return res.status(404).json({ message: "Comment not found" });
    }
    res.status(200).json(foundComment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createComment,
  getAllComments,
  deleteCommentById,
  addCommentToComment,
  getCommentById,
};
