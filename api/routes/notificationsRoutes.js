const notifications = require("../controllers/notificationsController");

module.exports = function (app) {
  app.route("/start").post(notifications.start);

  app.route("/stop").post(notifications.stop);

  app.route("/status").post(notifications.status);
};
