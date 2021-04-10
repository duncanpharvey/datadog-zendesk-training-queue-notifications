const zendesk = require("./zendesk");
const slack = require("./slack");
const cron = require("node-cron");

var status = 0;

const task = cron.schedule("* * * * *", poll, { scheduled: false }); // poll once every minute

async function poll() {
  const tickets = await zendesk.getTickets();
  const changed = zendesk.viewChanged(tickets);
  if (changed) {
    var message = `${tickets.length} ticket${
      tickets.length == 1 ? "" : "s"
    } in Training Queue\n`;

    for (var ticket of tickets) {
      message += `https://${process.env.ZENDESK_SUBDOMAIN}.zendesk.com/agent/tickets/${ticket.id} ${ticket.subject}\n`;
    }
    slack.send(message);
  }
}

function isStarted() {
  return status;
}

function start() {
  task.start();
  status = 1;
}

function stop() {
  task.stop();
  status = 0;
}

module.exports = {
  isStarted: isStarted,
  start: start,
  stop: stop,
};
