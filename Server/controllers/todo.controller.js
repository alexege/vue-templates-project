const Todo = require("../models/todo.model");
const Category = require("../models/category.model");

exports.createTodo = async (req, res) => {

  //Create the new Todo Object using info from the req.body
  const newTodo = new Todo({
    title: req.body.title,
    categories: [],
    priority: req.body.priority,
    completed: req.body.completed,
    author: req.body.author,
    createdAt: new Date(), //This fixes the Invalid Date problem
  });

  if (req.body.categories) {

    for (const cat of req.body.categories) {
      let value = await Category.findOne({ name: cat }).then((cat) =>
        newTodo.categories.push(cat)
      );
    }
    await newTodo.save(newTodo);
  }
  await res.status(200).send(newTodo);
};

exports.getAllTodos = (req, res) => {
  Todo.find()
    .populate("categories")
    .populate("author")
    .then((todos) => {
      res.status(200).send(todos);
    })
    .catch((error) => {
      console.log("error:", error);
      res.status(500).send({ message: error });
    });
};

exports.getTodoById = (req, res) => {
  //Search database for a Todo that has an _id matching the id provided in the url(id)
  Todo.findOne({ _id: req.params.id })
    .then((todo) => {
      res.send({ todo });
    })
    .catch((error) => {
      console.log("error:", error);
      res.status(500).send({ message: error });
    });
};

exports.updateTodoById = (req, res) => {
  //Updated Fields / Fields to Update
  let updateData = {
    title: req.body.title,
    completed: req.body.completed,
  };

  Todo.findByIdAndUpdate({ _id: req.params.id }, updateData)
    .then((todo) => {
      res.status(200).send({ todo });
    })
    .catch((error) => {
      res.status(500).send({ message: error });
    });
};

exports.deleteTodo = (req, res) => {
  Todo.deleteOne({ _id: req.params.id })
    .then(() => {
      res.status(200).send({ message: "Todo deleted!" });
    })
    .catch((error) => {
      res.status(500).send({ message: error });
      return;
    });
};

exports.deleteAllTodos = (req, res) => {
  Todo.deleteMany()
  .then(() => {
    res.status(200).send({ message: "Delete all todos!" })
  })
  .catch((error) => {
    res.status(500).send({ message: error })
    return
  })
}