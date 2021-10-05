### Summary
This application periodically polls Zendesk to see if tickets entered or exited a given view. This is currently only configured for the training queue but could be configured for other views as well. I believe this would be a useful feature for low volume queues (such as the training queue or certain spec queues).

### Overview

The application uses the Zendesk API to get the list of tickets in a given view. After retrieving these tickets, it compares the current list of tickets with the previous list of tickets and if there are any changes sends a notification to Slack. The frequency of the polling is determined by a cron job. This job is configured to run once every minute at the moment but is easily configurable.

Zendesk API: https://developer.zendesk.com/rest_api/docs/support/views#list-views 

Slack slash commands allow remotely getting the status, starting, or stopping of the app. These commands are verified through a Slack signing secret that is unique to the Slack workspace.

Verifying requests from Slack: 
* https://api.slack.com/authentication/verifying-requests-from-slack 
* https://medium.com/@rajat_sriv/verifying-requests-from-slack-using-node-js-69a8b771b704 


Example:

<img src="https://p-qkfgo2.t2.n0.cdn.getcloudapp.com/items/KoudrKoX/cd976d62-8485-4326-ae63-43ab6cae7442.jpg?source=viewer&v=30dadf31f280da8a2a9512c45d41c8ae"
alt="Slack Slash Commands" width="300"/>

<img src="https://p-qkfgo2.t2.n0.cdn.getcloudapp.com/items/P8u5bwBZ/6e65d645-588f-49e8-9536-d2d17dd98ce5.jpg?source=viewer&v=aedcb902229c6e29406df904742bea7b"
alt="Slack Slash Command Results" width="300"/>  

Slash Commands run to generate the output above:

/zd-status
/zd-start
/zd-status
/zd-stop
/zd-status

View notifications while cron job is running:

<img src="https://p-qkfgo2.t2.n0.cdn.getcloudapp.com/items/04uAqy6p/7d7f9ab0-2fd4-4025-b4cd-e34c937c27cf.jpg?source=viewer&v=8911a4d76629be535a57b92fd548313c"
alt="Slack View Notifications" width="600"/>  

### Setup

Launch and Connect to EC2: https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/EC2_GetStarted.html 

<img src="https://p-qkfgo2.t2.n0.cdn.getcloudapp.com/items/YEuRoJY5/53d03d6a-f748-4aed-b801-60786af2d77f.jpg?source=viewer&v=2b8aa7557a39aeb0d1213bac96db04fe"
alt="EC2 Setup 1" width="500"/> 

<img src="https://p-qkfgo2.t2.n0.cdn.getcloudapp.com/items/geubzBe0/2c174143-16fd-45b9-b501-ed12e1e75642.jpg?source=viewer&v=35aeba57009c1decb8c50cb65be9e712"
alt="EC2 Setup 2" width="500"/> 

<img src="https://p-qkfgo2.t2.n0.cdn.getcloudapp.com/items/eDujBeD8/d70cbcdf-5b55-4ec2-bcad-142cd885fdfc.jpg?source=viewer&v=22085690c9e574c350190921bbce9399"
alt="EC2 Setup 3" width="500"/>  

<img src="https://p-qkfgo2.t2.n0.cdn.getcloudapp.com/items/YEuRoJ21/99688871-e391-4878-ae50-a64fec1e394d.jpg?source=viewer&v=9ca187ea8d898137937fc9bc93b2d6e3"
alt="EC2 Setup 4" width="500"/>  

Create Slack App: https://api.slack.com/apps 
Slash Commands: https://api.slack.com/interactivity/slash-commands 

<img src="https://p-qkfgo2.t2.n0.cdn.getcloudapp.com/items/nOuokJZK/474e66cd-68e6-412e-be82-d1bad3bb570e.jpg?source=viewer&v=2cdc42a5152d7f161be0efcbafe4592f"
alt="Slack Slash Command Setup 1" width="400"/> 

Add EC2 IP address to slash command, making sure to prefix with http:// and use port 9000

http://ec2-3-239-100-32.compute-1.amazonaws.com:9000/start

<img src="https://p-qkfgo2.t2.n0.cdn.getcloudapp.com/items/d5u1E2qm/84e57c66-1318-4c7b-bb07-bb6ffce6453f.jpg?source=viewer&v=e2c1e5327479351fe815a6c44fce0cef"
alt="Slack Slash Command Setup 2" width="400"/> 

<img src="https://p-qkfgo2.t2.n0.cdn.getcloudapp.com/items/2Nuwy9Lw/cbb12ce7-63e5-458d-b830-725a4536d1c0.jpg?source=viewer&v=b1e87c1bbe74c0dde7652e69bf245053"
alt="Slack Slash Command Setup 3" width="400"/> 

Create ~/.zendesk-notifications.env with the following environment variables populated:

```
SLACK_SIGNING_SECRET=
SLACK_WEBHOOK_URL=
ZENDESK_SUBDOMAIN=
ZENDESK_VIEW_ID=
ZENDESK_USERNAME=
ZENDESK_API_TOKEN=
```

Run setup.sh (included in repository). This script initializes the environment, downloads and installs the npm project from Github, and starts the app.

<img src="https://p-qkfgo2.t2.n0.cdn.getcloudapp.com/items/NQuwrB8k/f240419f-2cb1-4e67-b190-f461a76703bb.jpg?source=viewer&v=bf620127ea16ab67f996f29d6cc53090"
alt="Setup Script" width="400"/> 

Outstanding Questions:

* How to determine what AWS IP addresses to whitelist for Slack app?
* If these can be determined, how to programmatically maintain if the IP addresses rotate
* Does pm2 need to be configured to handle server restarts? https://www.npmjs.com/package/pm2 

Potential Extensions:

* Currently the app gets the tickets in the training queue by default. Slash commands can have an additional text parameter passed that could specify the name of a view (or a shortened version of it) to enable notifications for a given view. Could have dedicated channels in Slack for each view
  * /zd-status training
* Add endpoints for creating/updating/deleting a cron job for a view
* Move entire app to Lambda function(s)
  * I’m new to Lambda functions but this seems like it would remove the headache of managing the EC2 instance
