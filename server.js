const express = require("express");
const basicAuth = require("express-basic-auth");
const app = express();

app.use(
  basicAuth({
    users: { [process.env.appUsername]: process.env.appPassword },
    unauthorizedResponse: getUnauthorizedResponse,
  })
);

function getUnauthorizedResponse(req) {
  var message;
  if (req.auth) {
    message = "Invalid credentials";
  } else {
    message = "No credentials provided";
  }
  return { message: message };
}

const routes = require("./api/routes/notificationsRoutes");
routes(app);

app.use(function (req, res) {
  res.status(404).send({ url: `${req.originalUrl} not found` });
});

const port = process.env.PORT || 5000;
app.listen(port); // use port if provided, otherwise use 5000
