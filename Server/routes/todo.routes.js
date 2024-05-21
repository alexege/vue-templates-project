const controller = require("../controllers/todo.controller")
module.exports = (app) => {
    app.use((req, res, next) => {
        res.header(
            "Access-Control-Allow-Headers",
            "x-access-token, Origin, Content-Type, Accept"
        )
        next()
    })

    //Get All Todos
    app.get("/api/todo/allTodos", controller.findAllTodos)
    
    //Get a Todo by Id
    app.get("/api/todo/:id", controller.findById)

    //Add a Todo
    app.post("/api/todo/addTodo", controller.addTodo)
    
    //Update a Todo
    app.patch("/api/todo/update/:id", controller.updateTodo)

    //Delete a Todo
    app.delete("/api/todo/:id", controller.deleteTodo)
}