const controller = require("../controllers/reply.controller");
module.exports = (app) => {
  app.use((req, res, next) => {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  //Add Reply
  app.post("/api/replies", controller.createReply);

  //Get Reply
  app.get("/api/replies", controller.getAllReplies);

  //Get Reply by Id
  app.get("/api/replies/:id", controller.getReplyById);

  //Update Reply by Id
  app.put("/api/replies/:id", controller.updateReplyById);

  //Delete Reply
  app.delete("/api/replies/:id", controller.deleteReplyById);
};
