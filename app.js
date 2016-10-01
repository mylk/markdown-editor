var express = require("express");
var app = express();

var http = require("http");
var path = require("path");
var fs = require("fs");
var webSocketServer = require("ws").Server;
var markdown = require("markdown").markdown;
var controllers = require("./controllers").actions;
var mongoose = require("mongoose");
var logModel = require("./models").logModel;
var utils = require("./utils");
var wkhtmltopdf = require("wkhtmltopdf");
//var serveFavicon = require("serve-favicon");
//var morgan = require("morgan");
var bodyParser = require("body-parser");
var methodOverride = require("method-override");

var modules = {
    markdown: markdown,
    fs: fs,
    logModel: logModel,
    utils: utils,
    wkhtmltopdf: wkhtmltopdf
};

var routes = require("./routes")(app, controllers, modules);

// all environments
app.set("port", process.env.PORT || 3000);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");
app.use(express.static(path.join(__dirname, "public")));
//app.use(serveFavicon);
//app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ "extended": false }));
app.use(methodOverride);

var server = http.createServer(app).listen(app.get("port"), function () {
    console.log("Express server listening on port " + app.get("port"));
});

// create the websocket server
var wss = new webSocketServer({ server: server });
wss.on("connection", function (socket) {
    socket.on("message", function (data) {
        socket.send(markdown.toHTML(data));
    });

    socket.on("error", function (error) {
        // @TODO log this somewhere
        console.log(error);
    });
});

// 404 error if no route found
app.use(function (req, res, next) {
    res.render("404", { status: 404, url: req.url });
});

// development only
if ("development" === app.get("env")) {
    app.use(function (err, req, res, next) {
        res.status(500);
        res.render("error", { error: err });
    });
}

// catch uncaught exceptions
process.on("uncaughtException", function (err) {
    // @TODO log this somewhere
    console.log(err.stack);
});