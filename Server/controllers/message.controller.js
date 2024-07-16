/*
 *   Keep the Controller for:
 *   - Handling API requests, interactions with database, send responses
 */
const User = require("../models/user.model");
const { Message, Reply } = require("../models/message.model");
const createMessage = async (req, res) => {
  try {
    const message = new Message(req.body); //Add author to message
    const { authorId } = req.body;
    const author = await User.findById(authorId);
    if (!author) return res.status(404).json({ message: "Author not found" });
    message.author = authorId;
    await message.save();
    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const getAllMessages = async (req, res) => {
  try {
    const messages = await Message.find().populate("replies");

    for (const message of messages) {
      await populateReplies(message);
    }

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Helper function to recursively populate replies
async function populateReplies(message) {
  // Populate replies of the current message
  await Message.populate(message, [{ path: "replies" }, { path: "author" }]);

  // Recursively populate each reply's replies
  if (message.replies && message.replies.length > 0) {
    for (let i = 0; i < message.replies.length; i++) {
      message.replies[i] = await populateReplies(message.replies[i]);
    }
  }
  return message;
}

const getMessageById = async (req, res) => {
  try {
    const { id } = req.params;
    const foundMessage = await Message.findById(id)
      .populate("replies")
      .populate("author");
    if (!foundMessage)
      return res.status(404).json({ error: "Message not found" });
    res.status(200).json(foundMessage);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};
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
    res.status(500).json({ message: error.message });
  }
};
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
    res.status(500).json({ message: error.message });
  }
};
const addReplyToMessage = async (req, res) => {
  console.log("Getting to reply to message: ", req.body);
  const { content, replies, depth, authorId } = req.body;
  try {
    //Create a new reply
    const newReply = new Reply({ content, replies, depth, author: authorId }); //Save the reply
    await newReply.save(); //Add the reply to the message's replies array

    await Message.findByIdAndUpdate(
      req.params.id,
      {
        $push: {
          replies: newReply._id,
        },
      },
      {
        new: true, //Returns updated document instead of original
        useFindAndModify: false, //Tells MongoDB to use native MongoDB
      }
    ).populate("author"); //Return the updated document //Alternative option
    /*
     *   const message = await Message.findById(messageId)
     *   if (!message) {
     *       return res.status(404).json({ message: 'Message not found' })
     *   }
     *
     *   message.replies.push(newReply._id)
     *   await message.save()
     *
     *
     *   const populatedReply = await Reply.findById(newReply._id).populate("author")
     *   res.status(201).json(populatedReply)
     *
     */
    console.log("msg - sending back: ", newReply);
    res.status(201).json(newReply);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const addReplyToReply = async (req, res) => {
  console.log("Getting to reply to reply: ", req.body);

  const { content, replies, depth, authorId } = req.body;
  try {
    //Create a new reply
    const newReply = new Reply({ content, replies, depth, author: authorId }); //Save the reply
    const savedReply = await newReply.save(); //Add the reply to the source reply's replies array
    console.log("-----newReply-----:", savedReply);

    const parentReply = await Reply.findById(req.params.id);
    if (!parentReply) {
      return res.status(404).json({ message: "Parent reply not found" });
    }

    parentReply.replies.push(savedReply._id);
    await parentReply.save();

    const topLevelReplyId = req.params.id;

    populateReplies(topLevelReplyId)
      .then((populatedReply) => {
        console.log("Populated reply:", populatedReply);
      })
      .catch((error) => {
        console.error("Error:", error);
      });

    // await Reply.findByIdAndUpdate(
    //   req.params.id,
    //   {
    //     $push: {
    //       replies: newReply._id,
    //     },
    //   },
    //   {
    //     new: true,
    //     useFindAndModify: false,
    //   }
    // ).populate("replies");
    //   .populate("author")
    //   .populate("replies");
    // console.log("rep - sending back: ", savedReply);
    // console.log("rep - sending back: ", newReply);

    const populatedReply = await Reply.findById(savedReply._id).populate(
      "author"
    );
    console.log("rep - sending back: ", populatedReply);

    res.status(201).json(populatedReply);
    // res.status(201).json(savedReply);
    // res.status(201).json(newReply);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
module.exports = {
  createMessage,
  getAllMessages,
  getMessageById,
  updateMessageById,
  deleteMessageById,
  addReplyToMessage,
  addReplyToReply,
  populateReplies,
};
