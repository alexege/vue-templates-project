const express = require("express");
const cors = require("cors");
const brcypt = require("bcryptjs");

const app = express();

var corsOptions = {
  origin: "http://127.0.0.1:8081",
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

const db = require("./models");
const dbConfig = require("./config/db.config");

const Role = require("./models/role.model");
const Category = require("./models/category.model");

//Model Connection
// const User = require("./models/user.model")

db.mongoose
  .connect(`mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`)
  .then(() => {
    console.log("Successfully connected to Mongodb!");
    //Triggering the database seeding if no items exist
    initial();
  })
  .catch((err) => {
    console.log("Connection error", err);
    process.exit();
  });

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Alexander's Vue Templates Project." });
});

// routes
require("./routes/auth.routes")(app);
require("./routes/user.routes")(app);
require("./routes/todo.routes")(app);
require("./routes/timer.routes")(app);
require("./routes/category.routes")(app);
require("./routes/message.routes")(app);
require("./routes/reply.routes")(app);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

//Seed the database
function initial() {
  //Setup default roles
  Role.estimatedDocumentCount().then((count) => {
    if (count === 0) {
      //User
      const user = new Role({
        name: "user",
      });

      user
        .save(user)
        .then(() => {
          console.log("Adding User role to database!");
        })
        .catch((err) => {
          console.log("err:", err);
        });

      //Moderator
      const moderator = new Role({
        name: "moderator",
      });

      moderator
        .save(moderator)
        .then(() => {
          console.log("Adding Moderator role to database!");
        })
        .catch((err) => {
          console.log("err:", err);
        });

      //Admin
      const admin = new Role({
        name: "admin",
      });

      admin
        .save(admin)
        .then(() => {
          console.log("Adding Admin role to database!");
        })
        .catch((err) => {
          console.log("err:", err);
        });
    }
  });

  Category.estimatedDocumentCount().then((count) => {
    console.log("No categories detected!");
    if (count == 0) {
      const category = new Category({
        name: "All",
      });

      category
        .save(category)
        .then(() => {
          console.log("Added 'all' category");
        })
        .catch((err) => {
          console.log("err:", err);
        });
    }
  });
}

// https://www.bezkoder.com/node-express-mongodb-crud-rest-api/
