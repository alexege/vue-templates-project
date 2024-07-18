/*
 *   Keep the Controller for:
 *   - Handling API requests, interactions with database, send responses
 */
const User = require("../models/user.model");
const { Message, Reply } = require("../models/message.model");
const messageRoutes = require("../routes/message.routes");

const createMessage = async (req, res) => {
  console.log("req.body: ", req.body);
  const authorId = req.body.author;
  try {
    const message = new Message(req.body); //Add author to message

    //Find author by authorId and set new Message's author to that author Object
    // const { author } = req.body;
    // const author = await User.findById(authorId);
    // if (!author) return res.status(404).json({ message: "Author not found" });
    // message.author = author;
    await message.save();

    console.log("message:", message);

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
    const foundMessage = await Message.findById(id).populate("replies");
    // .populate("author");
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

const deleteReplyById = async (req, res) => {
  try {
    const { id } = req.params;

    const deleteRepliesRecursively = async (replyId) => {
      const reply = await Reply.findById(replyId).populate("replies");
      if (!reply) return;

      for (let nestedReply of reply.replies) {
        await deleteRepliesRecursively(nestedReply._id);
      }

      await Reply.findByIdAndDelete(replyId);
    };

    // Find the parent message or reply
    const parentMessage = await Message.findOne({ replies: id });
    const parentReply = await Reply.findOne({ replies: id });

    // Recursively delete replies
    await deleteRepliesRecursively(id);

    // Remove the reference to the deleted reply from the parent
    if (parentMessage) {
      parentMessage.replies.pull(id);
      await parentMessage.save();
    }
    if (parentReply) {
      parentReply.replies.pull(id);
      await parentReply.save();
    }

    res.status(200).json({ message: "Reply deleted successfully" });
  } catch (error) {
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
    console.log(`deleteDmsg: ${JSON.stringify(deletedMessage, null, 2)}`);
    const result = await Reply.deleteMany({
      sourceId: deletedMessage._id,
    });

    res.status(200).json({
      message: `Message deleted successfully, ${result.deletedCount}`,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};
const addReplyToMessage = async (req, res) => {
  console.log("Getting to reply to message: ", req.body);
  const authorId = req.body.author;
  try {
    //Create a new reply
    const newReply = new Reply(req.body); //Save the reply

    //Populate the author
    const author = await User.findById(authorId);
    if (!author) return res.status(404).json({ message: "Author not found" });
    newReply.author = author;

    const savedReply = await newReply.save(); //Add the reply to the message's replies array

    const currentMessageId = req.params.id;
    const currentMessage = await Message.findById(currentMessageId);

    if (!currentMessage) {
      return res.status(404).json({ message: "Message not found!" });
    }

    currentMessage.replies.push(savedReply._id);
    await currentMessage.save();

    res.status(201).json(newReply);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addReplyToReply = async (req, res) => {
  console.log("Getting to reply to reply: ", req.body);
  console.log("id:", req.params.id);
  const authorId = req.body.author;
  try {
    //Create a new reply
    const newReply = new Reply(req.body); //Save the reply

    //Populate the author
    const author = await User.findById(authorId);
    if (!author) return res.status(404).json({ message: "Author not found" });
    newReply.author = author;

    const savedReply = await newReply.save(); //Add the reply to the source reply's replies array

    //Add new reply to existing reply
    const currentReplyId = req.params.id;
    const currentReply = await Reply.findById(currentReplyId);

    if (!currentReply) {
      return res.status(404).json({ message: "Reply not found" });
    }

    currentReply.replies.push(savedReply._id);
    await currentReply.save();

    // console.log("---currentReply is:---", JSON.stringify(currentReply));
    res.status(200).json(savedReply);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// const addReplyToReply = async (req, res) => {
//   console.log("Getting to reply to reply: ", req.body);
//   const authorId = req.body.author;
//   try {
//     //Create a new reply
//     const newReply = new Reply(req.body); //Save the reply

//     //Populate the author
//     const author = await User.findById(authorId);
//     if (!author) return res.status(404).json({ message: "Author not found" });
//     newReply.author = author;

//     const savedReply = await newReply.save(); //Add the reply to the source reply's replies array

//     const parentReply = await Reply.findById(req.params.id);
//     if (!parentReply) {
//       return res.status(404).json({ message: "Parent reply not found" });
//     }

//     parentReply.replies.push(savedReply._id);
//     await parentReply.save();

//     const topLevelReplyId = req.params.id;

//     populateReplies(topLevelReplyId)
//       .then((populatedReply) => {
//         console.log("Populated reply:", populatedReply);
//       })
//       .catch((error) => {
//         console.error("Error:", error);
//       });

//     // await Reply.findByIdAndUpdate(
//     //   req.params.id,
//     //   {
//     //     $push: {
//     //       replies: newReply._id,
//     //     },
//     //   },
//     //   {
//     //     new: true,
//     //     useFindAndModify: false,
//     //   }
//     // ).populate("replies");
//     //   .populate("author")
//     //   .populate("replies");
//     // console.log("rep - sending back: ", savedReply);
//     // console.log("rep - sending back: ", newReply);

//     const populatedReply = await Reply.findById(savedReply._id).populate(
//       "author"
//     );
//     console.log("rep - sending back: ", populatedReply);

//     res.status(201).json(populatedReply);
//     // res.status(201).json(savedReply);
//     // res.status(201).json(newReply);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };
module.exports = {
  createMessage,
  getAllMessages,
  getMessageById,
  updateMessageById,
  deleteMessageById,
  deleteReplyById,
  addReplyToMessage,
  addReplyToReply,
  populateReplies,
};
