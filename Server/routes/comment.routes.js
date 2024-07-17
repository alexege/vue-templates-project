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

  // //Get Comment by Id
  // app.get("/api/comments/:id", controller.getCommentById);

  // //Update Comment by Id
  // app.put("/api/comments/:id", controller.updateCommentById);

  //Delete Comment
  app.delete("/api/comments/:id", controller.deleteCommentById);

  // //Add Reply to Comment
  // app.post("/api/comments/:id/reply", controller.addReplyToComment);

  // //Add Reply to Reply
  // app.post("/api/replies/:id/reply", controller.addReplyToReply);
};
