const express = require("express");
const cors = require("cors");
const brcypt = require("bcryptjs");

const app = express();

var corsOptions = {
  origin: "http://localhost:8081"
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

const db = require("./models");
const dbConfig = require("./config/db.config");

//Model Connection
// const User = require("./models/user.model")

db.mongoose.connect(`mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`)
.then(() => {
  console.log("Successfully connected to Mongodb!");
  //Triggering the database seeding if no items exist
  // init();
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
require('./routes/user.routes')(app);

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

//Seed the database
function init() {
  //TODO
}

// https://www.bezkoder.com/node-express-mongodb-crud-rest-api/