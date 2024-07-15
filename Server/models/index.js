const dbConfig = require("../config/db.config.js");

const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const db = {};

db.mongoose = mongoose;

db.url = dbConfig.url;

db.refreshToken = require("./refreshToken.model");
db.user = require("./user.model");
db.role = require("./role.model");
db.category = require("./category.model");
db.message = require("./message.model");

db.ROLES = ["user", "admin", "moderator"];

module.exports = db;
