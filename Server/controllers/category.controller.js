const db = require("../models");
const Category = require("../models/category.model");

exports.findAllCategories = (req, res) => {
  Category.find()
    .then((categories) => {
      res.status(200).send(categories);
    })
    .catch((error) => {
      console.log("error:", error);
      res.status(500).send({ message: error });
    });
};

exports.findById = (req, res) => {
  Category.findOne({ _id: req.params.id })
    .then((category) => {
      res.send({ category });
    })
    .catch((error) => {
      console.log("error:", error);
      res.status(500).send({ message: error });
    });
};

exports.addCategory = (req, res) => {
  console.log("addCategory:", req.body);
  const newCategory = new Category({
    name: req.body.name,
    description: req.body.description,
  });

  Category.create(newCategory);
  res.status(200).send(newCategory);
};

exports.updateCategory = (req, res) => {
  let updateData = {
    name: req.body.name,
    description: req.body.description,
  };

  Category.findByIdAndUpdate({ _id: req.params.id }, updateData)
    .then((category) => {
      res.status(200).send({ category });
    })
    .catch((error) => {
      res.status(500).send({ message: error });
    });
};

exports.deleteCategory = (req, res) => {
  Category.deleteOne({ _id: req.params.id })
    .then(() => {
      res.status(200).send({ message: "Category deleted!" });
    })
    .catch((error) => {
      res.status(500).send({ message: error });
      return;
    });
};
