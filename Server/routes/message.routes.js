const controller = require("../controllers/message.controller");
module.exports = (app) => {
  app.use((req, res, next) => {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  //Get All Messages
  app.get("/api/message/allMessages", controller.getMessages);

  //Get a Message by Id
  app.get("/api/message/:id", controller.findMessageById);

  //Add a Message
  app.post("/api/message/addMessage", controller.addMessage);

  //Update a Message
  app.patch("/api/message/update/:id", controller.updateMessageById);

  //Delete a Message
  app.delete("/api/message/:id", controller.deleteMessageById);
};
