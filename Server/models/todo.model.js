const mongoose = require("mongoose");

const Todo = mongoose.model(
  "Todo",
  new mongoose.Schema(
    {
      title: String,
      categories: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Category",
        },
      ],
      priority: String,
      completed: Boolean,
      author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      comments: String,
    },
    { timestamps: true }
  )
);

module.exports = Todo;

//TODO: Update existing comments from array of strings to array of Comment Objects

// comments: [{
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Comment'
// }]
