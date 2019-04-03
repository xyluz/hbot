const { RTMClient } = require('@slack/rtm-api');

//IF we use Events API.

const config = require('./config');
const rp = require('request');
// An access token (from your Slack app or custom integration - xoxp, xoxb)
const token = config.SLACK_TOKEN;

const tasks = require('./tasks');

// The client is initialized and then started to get an active connection to the platform
const rtm = new RTMClient(token);


(async () => {
  try {
    await rtm.start();
  } catch (error) {
    console.log(error);
  }
})();

  rtm.on('ready', (event) => {
    console.log("*********", "ready to roll!!");
  });

  rtm.on('message',(event) => {
    let channelId = event.channel;
    let userId = event.user;
    // sometimes the event.text is undefined
    let message = event.text || 'EMPTY MESSAGE!';
    //This hack won't be needed, as we would subscribe to 'on_message' event, which means the bot would only response to messages directed at it
    let hbot = message.substring(0,12);


    if(hbot === '<@UHKEQ2GDC>' && message.length > hbot.length){
      //this means their message comtains more than just my name

      //check the message after my name, and see if it means what i want

      let afterName = message.substring(12,message.length);

      //format @hbot add username

      let commands = afterName.split(' ');

      if(commands[1] == 'add'){
        //connect to github

      const headers = {'user-agent': 'node.js'};
      const opts = {
        method: "PUT",
        baseUrl: "https://api.github.com/",
        uri: "orgs/hnginternship5/memberships/" + commands[2] + "?access_token=" + config.GITHUB_TOKEN,
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
          rtm.sendMessage('<@' + userId +'>, You are already a member of the github organization', channelId);
        } else if (res.body.state == 'pending') {
          rtm.sendMessage('<@' + userId +'>, I have sent an invite to ' + commands[2] + '! Cheers! 🙂', channelId);
        } else {
          console.log(res);
          rtm.sendMessage('<@' + userId +'>, Sorry! I could not invite ' + commands[2] + ' to github org! ☹', channelId);
        }
     });

        rtm.sendMessage('Okay <@' + userId +'>, Adding ' + commands[2] + ' to github organization...', channelId);
      }else if(commands[1] == 'show'){

        if(commands[2] == 'tasks' || 'task'  || 'works' || 'todo'){
          console.log(channelId.toLowerCase());
          rtm.sendMessage('<@' + userId +'>,' + tasks.channel(channelId), channelId);

        }

      }else{
        rtm.sendMessage('Hey <@' + userId +'>, Sorry! cannot do that yet!', channelId);
      }


    }

    if (message === '<@UHKEQ2GDC>')
        rtm.sendMessage('Hello there <@' + userId +'>, how can i help you? 🙂', channelId);
      console.log(message);
});
