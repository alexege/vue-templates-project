const mongoose = require("mongoose");

const Todo = mongoose.model(
    "Todo",
    new mongoose.Schema({
        title: String,
        category: String,
        priority: String,
        completed: Boolean,
        author: String,
        comments: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Comment'
        }]
    },
    { timestamps: true})
);

module.exports = Todo;