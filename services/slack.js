const Slack = require("slack-node");
const slack = new Slack();

function send(message) {
  slack.setWebhook(process.env.SLACK_WEBHOOK_URL);
  slack.webhook({ text: message }, (err) => {
    if (err) {
      console.log(`failed to post message to slack: ${err}`);
    }
  });
}

module.exports = {
  send: send,
};
