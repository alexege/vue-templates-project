const controller = require("../controllers/todo.controller");
module.exports = (app) => {
  app.use((req, res, next) => {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  //Add Todo
  app.post("/api/todo", controller.createTodo);

  //Get Todos
  app.get("/api/todo", controller.getAllTodos);

  //Get Todo by Id
  app.get("/api/todo/:id", controller.getTodoById);

  //Update Todo
  app.put("/api/todo/:id", controller.updateTodoById);
  
  //Delete Todo
  app.delete("/api/todo/:id", controller.deleteTodo);

  //Delete all Todos
  app.delete("/api/todo/", controller.deleteAllTodos);
};