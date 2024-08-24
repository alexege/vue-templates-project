const controller = require("../controllers/timer.controller")
module.exports = (app) => {
    app.use((req, res, next) => {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        )
        next()
    })

  //Add Timer
  app.post("/api/timers", controller.createTimer);

  //Get Timers
  app.get("/api/timers", controller.getAllTimers);

  //Get Timer by Id
  app.get("/api/timers/:id", controller.getTimerById);

  //Update Timer by Id
  app.put("/api/timers/:id", controller.updateTimerById);

  //Delete Timer
  app.delete("/api/timers/:id", controller.deleteTimer);
};