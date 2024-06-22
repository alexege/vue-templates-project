const mongoose = require("mongoose");

const Timer = mongoose.model(
  "Timer",
  new mongoose.Schema(
    {
      name: String,
      type: String,
      duration: Number,
      isActive: Boolean,
      endDateTime: Date,
      creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      img: {
        type: String,
      },
    },
    { timestamps: true }
  )
);

module.exports = Timer;
