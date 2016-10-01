var mongoose = require("mongoose");

// @TODO: assign username and password
mongoose.connect("mongodb://localhost:27017/markdown");

var logSchema = new mongoose.Schema({
    ip: String,
    browser: String,
    datetime: String
});

module.exports = mongoose.model("logs", logSchema);