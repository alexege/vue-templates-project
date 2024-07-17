const mongoose = require("mongoose");

const Message = mongoose.model(
  "Message",
  new mongoose.Schema(
    {
      content: {
        type: String,
      },
      depth: {
        type: Number,
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
      depth: {
        type: Number,
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
