const User = require("../models/user.model");
const { Message, Reply } = require("../models/message.model");

const getReplies = (req, res) => {
  Reply.find()
    .populate("replies")
    .populate("author")
    .then((replies) => {
      res.status(200).send(replies);
    })
    .catch((error) => {
      res.status(500).send({ reply: error });
    });
};

const findReplyById = async (req, res) => {
  try {
    const { id } = req.params;
    const foundReply = await Reply.findById(id);

    if (!foundReply) return res.status(404).json({ error: "Reply not found" });

    // Success
    res.status(200).json(foundReply);
  } catch (error) {
    console.error(error);
    res.status(500).json({ reply: "Server error" });
  }
};

const addReply = async (req, res) => {
  console.log("Adding a reply", req.body);
  try {
    const reply = new Reply(req.body);

    //Add author to reply
    const { authorId } = req.body;
    const author = await User.findById(authorId);
    if (!author) return res.status(404).json({ reply: "Author not found" });
    reply.author = authorId;

    await reply.save();
    console.log("State of reply: ", reply);
    res.status(201).json(reply);
  } catch (error) {
    res.status(500).json({ reply: "Server error" });
  }
};

const addReplyToMessage = async (req, res) => {
  console.log("Attempting to add reply to Message", req.body);
  console.log("Attempting to add reply to Message", req.params);
  try {
    const newReply = new Reply(req.body);
    newReply.save();

    // const response = await Reply.create(req.body);
    console.log("reply created: ", newReply);
    console.log("id: ", req.params.id);
    const message = await Message.findById(req.params.id)
      .populate("replies")
      .populate("author");
    console.log("-----:message", message);
    if (message) {
      message.replies.push(newReply);
      message.save();
      res.status(200).json(message);
    }
  } catch (error) {
    res.status(500).json({ message: `Server error: ${error}` });
  }

  //Returns a Reply Object
};

const addReplyToReply = async (req, res) => {
  console.log("Attempting to add reply to Message", req.body);
  try {
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Update a reply by ID
const updateReplyById = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedReply = await Reply.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedReply) {
      return res.status(404).json({ reply: "Reply not found" });
    }

    res.status(200).json(updatedReply);
  } catch (error) {
    console.error(error);
    res.status(500).json({ reply: "Server error" });
  }
};

// Delete a reply by ID
const deleteReplyById = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedReply = await Reply.findByIdAndDelete(id);

    if (!deletedReply) {
      return res.status(404).json({ reply: "Reply not found" });
    }

    res.status(200).json({ reply: "Reply deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ reply: "Server error" });
  }
};

module.exports = {
  getReplies,
  findReplyById,
  addReply,
  addReplyToMessage,
  addReplyToReply,
  updateReplyById,
  deleteReplyById,
};
