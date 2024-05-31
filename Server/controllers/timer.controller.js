const db = require("../models");
const Timer = require("../models/timer.model");
// const User = require("../models/user.model");

exports.findAllTimers = (req, res) => {
  Timer.find()
    .then((timers) => {
      res.status(200).send(timers);
    })
    .catch((error) => {
      console.log("error:", error);
      res.status(500).send({ message: error });
    });
};

exports.findTimer = (req, res) => {
  Timer.findOne({ _id: req.params.id })
    .then((timer) => {
      res.status(200).send(timer);
    })
    .catch((error) => {
      console.log("error:", error);
      res.status(500).send({ message: error });
    });
};

exports.addTimer = (req, res) => {
  console.log("req.body: ", req.body);
  const newTimer = new Timer({
    name: req.body.name,
    type: req.body.type,
    startTime: req.body.startTime,
    endTime: req.body.endTime,
    creator: null,
    img: null,
  });
  newTimer
    .save()
    .then((timer) => {
      if (req.body.creator) {
        User.findOne({ _id: { $in: req.body.creator } })
          .then((creator) => {
            timer.creator = creator;
            timer.save().catch((e) => {
              console.log("error:", e);
            });
          })
          .catch((e) => {
            console.log("error:", e);
          });
      }
      //To be reactive, this must return a timer object
      res.status(200).send(timer);
    })
    .catch((error) => {
      console.log("error:", error);
      res.status(500).send({ message: error });
    });
};

exports.updateTimer = (req, res) => {
  const updateData = {
    name: req.body.name,
    img: req.body.img,
  };
  Timer.findByIdAndUpdate({ _id: req.params.id }, updateData)
    .then((timer) => {
      res.status(200).send(timer);
    })
    .catch((error) => {
      res.status(500).send({ message: error });
    });
};

exports.deleteTimer = (req, res) => {
  Timer.deleteOne({ _id: req.params.id })
    .then((timer) => {
      res.status(200).send({ message: `${timer.name} timer was deleted` });
    })
    .catch((error) => {
      res.status(500).send({ message: error });
    });
};

// exports.deleteTodo = (req, res) => {
//     Todo.deleteOne({ _id: req.params.id })
//     .then(() => {
//         res.status(200).send({ message: "Todo deleted!" })
//     })
//     .catch((error) => {
//         res.status(500).send({ message: error })
//         return
//     })
// }
