const config = require("../config/auth.config");
const db = require("../models");
const User = db.user;
const Role = db.role;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
const { refreshToken: RefreshToken } = require("../models");

exports.allUsers = async (req, res) => {
  User.find()
    .populate("roles", "-__v")
    .then((users) => {
      res.status(200).send(users);
    })
    .catch((error) => {
      console.log("Error: ", error);
    });
};

exports.signup = (req, result) => {
  const user = new User({
    username: req.body.username,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8),
    img: "https://media.istockphoto.com/id/1393750072/vector/flat-white-icon-man-for-web-design-silhouette-flat-illustration-vector-illustration-stock.jpg?s=612x612&w=0&k=20&c=s9hO4SpyvrDIfELozPpiB_WtzQV9KhoMUP9R9gVohoU=",
  });

  user
    .save()
    .then((user) => {
      if (req.body.roles) {
        Role.find({ name: { $in: req.body.roles } })
          .then((roles) => {
            user.roles = roles.map((role) => role._id);
            user
              .save()
              .then((res) => {
                result.status(200).send({ user });
              })
              .catch((err) => console.log("error:", err));
          })
          .catch((err) => console.log("error:", err));
      } else {
        Role.findOne({ name: "user" })
          .then((role) => {
            user.roles = [role._id];
            user
              .save()
              .then((res) => {
                result.status(200).send({ user });
              })
              .catch((err) => console.log("error:", err));
          })
          .catch((err) => console.log("error:", err));
      }
    })
    .catch((err) => console.log("error:", err));
};

exports.signin = (req, res) => {
  console.log("user: ", req.body);
  User.findOne({
    username: req.body.username,
  })
    .populate("roles", "-__v")
    .exec()
    .then(async (user) => {
      if (!user) {
        return res.status(404).send({ message: "User not found." });
      }

      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password!",
        });
      }

      var token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: config.jwtExpiration,
      });

      let refreshToken = await RefreshToken.createToken(user);

      var authorities = [];

      for (let i = 0; i < user.roles.length; i++) {
        authorities.push("ROLE_" + user.roles[i].name.toUpperCase());
      }
      res.status(200).send({
        id: user._id,
        username: user.username,
        email: user.email,
        roles: authorities,
        accessToken: token,
        refreshToken: refreshToken,
        img: "https://media.istockphoto.com/id/1393750072/vector/flat-white-icon-man-for-web-design-silhouette-flat-illustration-vector-illustration-stock.jpg?s=612x612&w=0&k=20&c=s9hO4SpyvrDIfELozPpiB_WtzQV9KhoMUP9R9gVohoU=",
      });
    })
    .catch((err) => console.log("error:", err));
};

exports.signout = async (req, res) => {
  try {
    req.session = null;
    return res.status(200).send({ message: "You've been signed out!" });
  } catch (err) {
    this.next(err);
  }
};

exports.refreshToken = async (req, res) => {
  const { refreshToken: requestToken } = req.body;

  if (requestToken == null) {
    return res.status(403).json({ message: "Refresh Token is required!" });
  }

  try {
    let refreshToken = await RefreshToken.findOne({ token: requestToken });

    if (!refreshToken) {
      res.status(403).json({ message: "Refresh token is not in database!" });
      return;
    }

    if (RefreshToken.verifyExpiration(refreshToken)) {
      RefreshToken.findByIdAndRemove(refreshToken._id, {
        useFindAndModify: false,
      }).exec();

      res.status(403).json({
        message: "Refresh token was expired. Please make a new signin request",
      });
      return;
    }

    let newAccessToken = jwt.sign(
      { id: refreshToken.user._id },
      config.secret,
      {
        expiresIn: config.jwtExpiration,
      }
    );

    return res.status(200).json({
      accessToken: newAccessToken,
      refreshToken: refreshToken.token,
    });
  } catch (err) {
    return res.status(500).send({ message: err });
  }
};
