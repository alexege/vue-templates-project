const controller = require("../controllers/comment.controller");
module.exports = (app) => {
  app.use((req, res, next) => {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });
  //Add Comment
  app.post("/api/comments", controller.createComment);

  //Get Comment
  app.get("/api/comments", controller.getAllComments);

  //Get Comment by Id
  app.get("/api/comments/:id", controller.getCommentById);

  // //Update Comment by Id
  // app.put("/api/comments/:id", controller.updateCommentById);

  //Delete Comment
  app.delete("/api/comments/:id", controller.deleteCommentById);

  // //Add Comment to Comment
  app.post("/api/comments/:id/comment", controller.addCommentToComment);
};
