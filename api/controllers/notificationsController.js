const pollingService = require("../../services/polling");

function start(req, res) {
  var message;
  if (pollingService.isStarted()) {
    message = "notifications already running";
  } else {
    pollingService.start();
    message = "notifications started";
  }
  res.json({ text: message });
}

function stop(req, res) {
  var message;
  if (!pollingService.isStarted()) {
    message = "notifications already stopped";
  } else {
    pollingService.stop();
    message = "notifications stopped";
  }
  res.json({ text: message });
}

function status(req, res) {
  var message;
  if (pollingService.isStarted()) {
    message = "notifications are running";
  } else {
    message = "notifications are stopped";
  }
  res.json({ text: message });
}

module.exports = {
  start: start,
  stop: stop,
  status: status,
};
