const { createEventAdapter } = require('@slack/events-api');
const SlackClient = require('@slack/client').WebClient;
const config = require('./config');
const rp = require('request');
const tasks = require('./tasks');

const slackEvents = createEventAdapter(config.SLACK_SIGNING_SECRET, {
  includeBody: true
});

// Listen for mention event
slackEvents.on('app_mention', (event) => {
  const slack = new SlackClient(config.BOT_TOKEN);

  const message = event.text;
  const botUser = config.BOT_USER;

  const index = message.indexOf(botUser);

  let text = index !== 0
    ? message.substring(0, (message.length - botUser.length) - 1)
          : message.substring(botUser.length + 1);

  // We'll check if the user only mentions the bot without any additional
  // message and instruct them to follow a particular format, otherwise, we'll
  // parse the text and respond to their request.
  if (! text) {    
    return slack.chat.postMessage({
      channel: event.channel,
      text: `Hello there <@${event.user}>, to use this bot please follow the format: *@hbot add username*`
    }); 
  }

  const commands = text.split(' ');

  if (commands[0].toLowerCase() === 'add') {
    const headers = {'user-agent': 'node.js'};

    const opts = {
      method: "PUT",
      baseUrl: "https://api.github.com/",
      uri: "orgs/hnginternship5/memberships/" + commands[1] + "?access_token=" + config.GITHUB_TOKEN,
      json: true,
      headers,
    };

   rp(opts, function(err, res, body) {
     if (err) {
       console.error(err);
       return;
     }
     
     res = res.toJSON();
     
     if (res.body.state == 'active') {
        return slack.chat.postMessage({
          channel: event.channel,
          text: `<@${event.user}>, you are already a member of the github organization.`
        });
      } else if (res.body.state == 'pending') {
        return slack.chat.postMessage({
          channel: event.channel,
          text: `<@${event.user}>, I've sent an invite to *${commands[1]}*! Cheers! 🙂`
        });
      } else {
        console.log(res);
        return slack.chat.postMessage({
          channel: event.channel,
          text: `<@${event.user}>, Sorry, I could not invite *${commands[1]}* to github org. ☹`
        });
      }
   });
   
   return slack.chat.postMessage({
      channel: event.channel,
      text: `Okay <@${event.user}>, adding *${commands[1]}* to github orginization.`
    });
  } else if (commands[0].toLowerCase() === 'show') {
    if (commands[1].toLowerCase() == 'tasks' || 'task'  || 'works' || 'todo') {
      return slack.chat.postMessage({
        channel: event.channel,
        text: `<@${event.user}>, ${tasks.channel(event.channel)}`
      });
    }
  } else {
    return slack.chat.postMessage({
      channel: event.channel,
      text: `Hey <@${event.user}>, sorry, we cannot do that yet!`
    });
  }
});

slackEvents.on('error', console.error);

const port = process.env.PORT || 3000;

// Start a basic HTTP server
slackEvents.start(port).then(() => {
  console.log(`server listening on port ${port}`);
});