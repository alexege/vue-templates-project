const { authJwt, verifySignUp } = require("../middlewares");
const controller = require("../controllers/user.controller");

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  //Get User
  app.get(
    "/api/users/admin",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.adminBoard
  );

  //Get all Users
  app.get("/api/users/allUsers", controller.allUsers);

  //Find User by Id
  app.get("/api/users/:id", controller.findById);

  //Sign up user
  app.post(
    "/api/users/signup",
    [
      verifySignUp.checkDuplicateUsernameOrEmail,
      verifySignUp.checkRolesExisted,
    ],
    controller.signup
  );

  //Delete User
  app.delete("/api/users/:id", controller.deleteUser);
};
