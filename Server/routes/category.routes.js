const controller = require("../controllers/category.controller");
module.exports = (app) => {
  app.use((req, res, next) => {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  //Get All Categories
  app.get("/api/category/allCategories", controller.findAllCategories);

  //Get a Category by Id
  app.get("/api/category/:id", controller.findById);

  //Add a Category
  app.post("/api/category/addCategory", controller.addCategory);

  //Update a Category
  app.patch("/api/category/update/:id", controller.updateCategory);

  //Delete a Category
  app.delete("/api/category/:id", controller.deleteCategory);
};
