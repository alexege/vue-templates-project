const db = require("../models");
const Timer = require("../models/timer.model");

exports.createTimer = (req, res) => {
  const newTimer = new Timer({
    name: req.body.name,
    type: req.body.type,
    duration: req.body.duration,
    isActive: req.body.isActive,
    endDateTime: req.body.endDateTime,
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

exports.getAllTimers = (req, res) => {
  Timer.find()
    .then((timers) => {
      res.status(200).send(timers);
    })
    .catch((error) => {
      console.log("error:", error);
      res.status(500).send({ message: error });
    });
};

exports.getTimerById = (req, res) => {
  Timer.findOne({ _id: req.params.id })
    .then((timer) => {
      res.status(200).send(timer);
    })
    .catch((error) => {
      console.log("error:", error);
      res.status(500).send({ message: error });
    });
};

exports.updateTimerById = (req, res) => {
  const updateData = {
    name: req.body.name,
    duration: req.body.duration,
    isActive: req.body.isActive,
    endDateTime: req.body.endDateTime,
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