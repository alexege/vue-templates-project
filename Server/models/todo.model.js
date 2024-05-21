const mongoose = require("mongoose");

const Todo = mongoose.model(
    "Todo",
    new mongoose.Schema({
        title: String,
        category: String,
        priority: String,
        completed: Boolean,
        author: String,
        comments: String
    },
    { timestamps: true})
);

module.exports = Todo;

//TODO: Update existing author from string to User Object

// author: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "User"
// },

//TODO: Update existing comments from array of strings to array of Comment Objects

// comments: [{
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Comment'
// }]