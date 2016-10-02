module.exports = function (app, controllers, modules) {
    app.get("/", controllers.index(modules.mongoose, modules.logModel, modules.utils));
    // route for older browser support
    app.post("/render", controllers.render(modules.markdown));
    app.post("/export/:outputType/:inputType", controllers.export(modules.fs, modules.wkhtmltopdf));
    app.get("/export_file/:filename", controllers.exportFile(modules.fs));
    app.get("/help", function (req, res) {
        res.render("help", { title: "help" });
    });
};