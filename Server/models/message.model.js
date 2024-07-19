const mongoose = require("mongoose");

const Message = mongoose.model(
  "Message",
  new mongoose.Schema(
    {
      title: {
        type: String,
      },
      content: {
        type: String,
      },
      replies: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Reply",
        },
      ],
      author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    },
    { timestamps: true }
  )
);

const Reply = mongoose.model(
  "Reply",
  new mongoose.Schema(
    {
      content: {
        type: String,
      },
      parentId: {
        type: String,
      },
      sourceId: {
        type: String,
      },
      message: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message",
      },
      replies: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Reply",
        },
      ],
      author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    },
    { timestamps: true }
  )
);

module.exports = { Message, Reply };
