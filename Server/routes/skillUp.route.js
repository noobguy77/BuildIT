let middleware = require("../util/middleware.js");

module.exports = (app) => {

    const skillUp = require("../controllers/skillUp.controller.js");
    // Create a new skillup ac
    app.post(
        "/skillUp",
        // middleware.checkToken,
        skillUp.create
    );

    app.get(
        "/skillUp/update",
        // middleware.checkToken,
        skillUp.update
    )

};
