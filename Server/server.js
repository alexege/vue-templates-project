const express = require("express");
const cors = require("cors");
const boydParser = require("body-parser");
// const brcypt = require("bcryptjs");

const app = express();

var corsOptions = {
  origin: "http://localhost:8081"
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

const db = require("./models");
const dbConfig = require("./config/db.config");

// const User = require("./models/user.model")



// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Alexander's Vue Templates Project." });
});

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

// https://www.bezkoder.com/node-express-mongodb-crud-rest-api/