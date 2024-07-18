/*
 *   Keep the Controller for:
 *   - Handling API requests, interactions with database, send responses
 */
const User = require("../models/user.model");
const { Reply } = require("../models/message.model");
const createReply = async (req, res) => {
  try {
    const reply = new Reply(req.body); //Add author to reply
    const { authorId } = req.body;
    const author = await User.findById(authorId);
    if (!author) return res.status(404).json({ message: "Author not found" });
    reply.author = authorId;
    await reply.save();
    res.status(201).json(reply);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const getAllReplies = (req, res) => {
  try {
    Reply.find()
      .populate("replies")
      .populate("author")
      .then((replies) => {
        res.status(200).json(replies);
      });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const getReplyById = async (req, res) => {
  try {
    const { id } = req.params;
    const foundReply = await Reply.findById(id)
      .populate("replies")
      .populate("author");
    if (!foundReply) return res.status(404).json({ error: "Reply not found" }); // Success
    res.status(200).json(foundReply);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};
const updateReplyById = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedReply = await Reply.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updatedReply) {
      return res.status(404).json({ message: "Reply not found" });
    }
    res.status(200).json(updatedReply);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};
const deleteReplyById = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedReply = await Reply.findByIdAndDelete(id);
    if (!deletedReply) {
      return res.status(404).json({ message: "Reply not found" });
    }
    res.status(200).json({ message: "Reply deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};
module.exports = {
  createReply,
  getAllReplies,
  getReplyById,
  updateReplyById,
  deleteReplyById,
};
