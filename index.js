const { RTMClient } = require('@slack/rtm-api');

//IF we use Events API.

const config = require('./config');
var http = require("http");

// An access token (from your Slack app or custom integration - xoxp, xoxb)
const token = config.SLACK_TOKEN;


// The client is initialized and then started to get an active connection to the platform
const rtm = new RTMClient(token);


rtm.start()
  .catch(console.error);


  rtm.on('message',(event)=>{
    let conversationId = event.channel;
    let userId = event.user;
    let message = event.text;
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

        var options = {
          host: "developer.api.autodesk.com",
          path: "https://api.github.com/orgs/hnginternship5/memberships/" + commands[2] + "?access_token=" + config.GITHUB_TOKEN,
          method: "PUT"
      };

      var req = http.request(options, function (res) {

        res.on("data", function (data) {
            responseString += data;
            // save all the data from response
        });
        res.on("end", function () {
            console.log(responseString);
            // print to console when response ends
        });
    });

        rtm.sendMessage('Okay <@' + userId +'>, Adding you to github organization', conversationId);
      }else{
        rtm.sendMessage('Hey <@' + userId +'>, Sorry, cant do that yet', conversationId);
      }


    }

    if(message === hbot){
      //meaning their message is just my name
      rtm.sendMessage('Hello there <@' + userId +'>, how can i help you?', conversationId);
    }

  console.log(message);
});
