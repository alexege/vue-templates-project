const controller = require("../controllers/reply.controller");
module.exports = (app) => {
  app.use((req, res, next) => {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  //Get All Replies
  app.get("/api/reply/allReplies", controller.getReplies);

  //Get a Reply by Id
  app.get("/api/reply/:id", controller.findReplyById);

  //Add a Reply
  app.post("/api/reply/addReply", controller.addReply);

  //Add Reply to Message
  app.post("/api/reply/addReplyToMessage/:id", controller.addReplyToMessage);

  //Add Reply to Reply
  //   app.post("/api/reply/addReplyToReply", controller.addReplyToReply);

  //Update a Reply
  app.patch("/api/reply/update/:id", controller.updateReplyById);

  //Delete a Reply
  app.delete("/api/reply/:id", controller.deleteReplyById);
};
