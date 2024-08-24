const controller = require("../controllers/category.controller");
module.exports = (app) => {
  app.use((req, res, next) => {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

    //Add Category
    app.post("/api/categories", controller.createCategory);

    //Get Categories
    app.get("/api/categories", controller.getAllCategories);
  
    //Get Category by Id
    app.get("/api/categories/:id", controller.getCategoryById);
  
    //Update Category by Id
    app.put("/api/categories/:id", controller.updateCategoryById);
  
    //Delete Category
    app.delete("/api/categories/:id", controller.deleteCategory);
};
