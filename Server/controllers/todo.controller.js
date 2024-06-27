const db = require("../models");
const Todo = require("../models/todo.model");
const User = require("../models/user.model");
const Category = require("../models/category.model");

exports.findAllTodos = (req, res) => {
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

exports.findById = (req, res) => {
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

exports.addTodo = async (req, res) => {
  console.log("todo req.body:", req.body);

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
    console.log("req.body.categories: ", req.body.categories);

    for (const cat of req.body.categories) {
      console.log("cat:", cat);

      let value = await Category.findOne({ name: cat }).then((cat) =>
        newTodo.categories.push(cat)
      );
    }
    await newTodo.save(newTodo);
  }
  console.log("new todo: ", newTodo);
  await res.status(200).send(newTodo);
};

exports.updateTodo = (req, res) => {
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
