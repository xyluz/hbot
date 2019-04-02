const { RTMClient } = require('@slack/rtm-api');

//IF we use Events API.

const config = require('./config');
const rp = require('request');
// An access token (from your Slack app or custom integration - xoxp, xoxb)
const token = config.SLACK_TOKEN;


// The client is initialized and then started to get an active connection to the platform
const rtm = new RTMClient(token);


(async () => {
  try {
    const response = await rtm.start();
    // console.log(response);
  } catch (error) {
    console.log(error);
  }
})();

  rtm.on('ready', (event) => {
    console.log("*********", "ready to roll!!");
  });

  rtm.on('message',(event) => {
    let conversationId = event.channel;
    let userId = event.user;
    // sometimes the event.text is undefined
    let message = event.text || '<@UHFSY07C7>';
    //This hack won't be needed, as we would subscribe to 'on_message' event, which means the bot would only response to messages directed at it
    let hbot = message.substring(0,12);
    // console.log(message);
    // return;


    if(hbot === '<@UHKEQ2GDC>' && message.length > hbot.length){
      //this means their message comtains more than just my name

      //check the message after my name, and see if it means what i want

      let afterName = message.substring(12,message.length);

      //format @hbot add username

      let commands = afterName.split(' ');

      if(commands[1] == 'add'){
        //connect to github

        var options = {
          host: "api.github.com/",
          path: "orgs/hnginternship5/memberships/" + commands[2] + "?access_token=" + config.GITHUB_TOKEN,
          method: "PUT"
      };

      const opts = {
        method: "PUT",
        host: "https://api.github.com",
        uri: "orgs/hnginternship5/memberships/" + commands[2] + "?access_token=" + config.GITHUB_TOKEN,
      };

     rp(opts, function(err, res, body) {
       if (err) {
         console.error(err);
         return;
       }

     });

        rtm.sendMessage('Okay <@' + userId +'>, Adding you to github organization', conversationId);
      }else{
        rtm.sendMessage('Hey <@' + userId +'>, What are you saying?', conversationId);
      }


    }

    // if(message === hbot){
    //   //meaning their message is just my name
    //   rtm.sendMessage('Hello there <@' + userId +'>, how can i help you?', conversationId);
    // }

  console.log(message);
});
