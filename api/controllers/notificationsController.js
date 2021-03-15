async function start(req, res) {
  res.json({ message: "started" });
}

async function stop(req, res) {
  res.json({ message: "stopped" });
}

async function status(req, res) {
  res.json({ message: "status" });
}

module.exports = {
  start: start,
  stop: stop,
  status: status,
};
