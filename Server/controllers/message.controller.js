const User = require("../models/user.model");
const { Message } = require("../models/message.model");

const getMessages = (req, res) => {
  Message.find()
    .populate("replies")
    .populate("author")
    .then((messages) => {
      res.status(200).send(messages);
    })
    .catch((error) => {
      res.status(500).send({ message: error });
    });
};

const findMessageById = async (req, res) => {
  try {
    const { id } = req.params;
    const foundMessage = await Message.findById(id)
      .populate("replies")
      .populate("author");

    if (!foundMessage)
      return res.status(404).json({ error: "Message not found" });

    // Success
    res.status(200).json(foundMessage);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

const addMessage = async (req, res) => {
  console.log("Adding a message");
  try {
    const message = new Message(req.body);

    //Add author to message
    const { authorId } = req.body;
    const author = await User.findById(authorId);
    if (!author) return res.status(404).json({ message: "Author not found" });
    message.author = authorId;

    await message.save();
    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// const addReplyToMessage = async (req, res) => {
//   console.log("Attempting to add reply to Message", req.body);
//   try {
//   } catch (error) {
//     res.status(500).json({ message: "Server error" });
//   }
// };

// Update a message by ID
const updateMessageById = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedMessage = await Message.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedMessage) {
      return res.status(404).json({ message: "Message not found" });
    }

    res.status(200).json(updatedMessage);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete a message by ID
const deleteMessageById = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedMessage = await Message.findByIdAndDelete(id);

    if (!deletedMessage) {
      return res.status(404).json({ message: "Message not found" });
    }

    res.status(200).json({ message: "Message deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getMessages,
  findMessageById,
  addMessage,
  updateMessageById,
  deleteMessageById,
};
