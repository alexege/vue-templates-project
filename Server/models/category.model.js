const mongoose = require("mongoose");

const Category = mongoose.model(
  "Category",
  new mongoose.Schema(
    {
      name: {
        type: String,
        unique: true,
        trim: true,
      },
      description: {
        type: String,
        trim: true,
        maxLength: [40, "Description must not exceed 40 characters"],
      },
    },
    { timestamps: true }
  )
);

module.exports = Category;
