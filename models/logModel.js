module.exports = function (req, mongoose, utils) {
    var logSchema = new mongoose.Schema({
        ip: String,
        browser: String,
        datetime: String
    });

    var logSchemaInstance = mongoose.model("logs", logSchema);

    var logInstance = new logSchemaInstance({
        ip: req.connection.remoteAddress,
        browser: req.headers["user-agent"],
        datetime: utils.getDateTime()
    });

    return logInstance;
};