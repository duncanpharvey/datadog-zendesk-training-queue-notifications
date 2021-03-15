const axios = require("axios");

var ticketSet = new Set();

async function getTickets() {
  var tickets;
  // TODO: Paginate
  await axios({
    method: "get",
    url: `https://${process.env.ZENDESK_SUBDOMAIN}.zendesk.com/api/v2/views/${process.env.ZENDESK_VIEW_ID}/tickets`,
    auth: {
      username: process.env.ZENDESK_USERNAME,
      password: process.env.ZENDESK_API_TOKEN,
    },
  })
    .then(function (res) {
      tickets = res.data.tickets
        .map(({ id, subject }) => ({
          id,
          subject,
        }))
        .sort((a, b) => a.id - b.id);
    })
    .catch(function (error) {
      console.log(error);
    });
  return tickets;
}

function viewChanged(tickets) {
  const newTicketSet = new Set(tickets.map((ticket) => ticket.id));
  if (!isEqualSet(ticketSet, newTicketSet)) {
    console.log(`new: ${Array.from(newTicketSet)}`);
    console.log(`before: ${Array.from(ticketSet)}`);
    ticketSet = new Set();
    for (var ticket of tickets) {
      ticketSet.add(ticket.id);
    }
    console.log(`after: ${Array.from(ticketSet)}`);
    return true;
  } else {
    return false;
  }
}

function isEqualSet(setA, setB) {
  for (var elem of setA) {
    if (!setB.has(elem)) return false;
  }
  for (var elem of setB) {
    if (!setA.has(elem)) return false;
  }
  return true;
}

module.exports = {
  getTickets: getTickets,
  viewChanged: viewChanged,
};
