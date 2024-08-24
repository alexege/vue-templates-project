const controller = require("../controllers/message.controller");
module.exports = (app) => {
  app.use((req, res, next) => {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });
  //Add Message
  app.post("/api/messages", controller.createMessage);

  //Get Messages
  app.get("/api/messages", controller.getAllMessages);

  //Get Message by Id
  app.get("/api/messages/:id", controller.getMessageById);

  //Update Message by Id
  app.put("/api/messages/:id", controller.updateMessageById);

  //Delete Message
  app.delete("/api/messages/:id", controller.deleteMessageById);

  //Add Reply to Message
  app.post("/api/messages/:id/reply", controller.addReplyToMessage);

  //Add Reply to Reply
  app.post("/api/replies/:id/reply", controller.addReplyToReply);
};
