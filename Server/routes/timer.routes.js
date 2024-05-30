const controller = require("../controllers/timer.controller")
module.exports = (app) => {
    app.use((req, res, next) => {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        )
        next()
    })

    //Get All Timers
    app.get("/api/timer/allTimers", controller.findAllTimers)
    
    //Get a Timer by Id
    app.get("/api/timer/:id", controller.findTimer)

    //Add a Timer
    app.post("/api/timer/addTimer", controller.addTimer)
    
    //Update a Timer
    app.patch("/api/timer/update/:id", controller.updateTimer)

    //Delete a Timer
    app.delete("/api/timer/:id", controller.deleteTimer)
}