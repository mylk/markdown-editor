exports.index = function (logModel, utils) {
    return function (req, res) {
        res.render("index", { title: "home" });

        // req.connection retrives the net.Socket object of the request
        var logInstance = new logModel({
            ip: req.connection.remoteAddress,
            browser: req.headers["user-agent"],
            datetime: utils.getDateTime()
        });

        logInstance.save(function (err) {
            // @TODO: really log that error somewhere
            if (err) {
                console.error(err);
            }
        });
    };
};

// controller for older browser support
exports.render = function (markdown) {
    return function (req, res) {
        var data = "";

        req.on("data", function (chunk) {
            data += chunk;
        });

        req.on("end", function () {
            res.send(markdown.toHTML(data));
        });
    };
};

exports.export = function (fs, wkhtmltopdf) {
    return function (req, res) {
        var data = "";

        var outputType = req.params.outputType;
        var inputType = req.params.inputType;
        // @TODO: create a better random name
        var fileName = Date.now();

        req.on("data", function (chunk) {
            data += chunk;
        });

        req.on("end", function () {
            if (outputType === "text") {
                fs.writeFileSync("./public/export/" + fileName + "." + inputType, data);

                res.write(fileName + "." + inputType);
                res.end();
            } else if (outputType === "pdf") {
                inputType = "pdf";
                wkhtmltopdf(data, function () {
                    // send response when write finishes
                    res.write(fileName + "." + inputType);
                    res.end();
                }).pipe(fs.createWriteStream("./public/export/" + fileName + ".pdf"));
            }
        });
    };
};

exports.exportFile = function (fs) {
    return function (req, res) {
        var filename = req.params.filename.toString();
        var filenameArr = filename.split(".");
        var fileExt = filenameArr[filenameArr.length - 1];
        var fsReadOpts = {};

        if (fileExt !== "pdf") {
            fsReadOpts = { encoding: "utf-8" };
        }

        res.writeHead(200, {
            "Content-type": "application/octet-stream",
            "Content-disposition": "attachment; filename=" + filename
        });

        res.write(fs.readFileSync("./public/export/" + filename, fsReadOpts));
        res.end();
        fs.unlink("./public/export/" + filename);
    };
};