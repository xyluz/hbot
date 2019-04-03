let tasks = {};

tasks.channel = (name)=>{

    name = name.toLowerCase();

    switch(name){
        case 'one':
        case '1':
        case 'stage1':
        case 'GHJC6MKM3':
        case 'ghdkf9fug':
        case 'stageone':
            return "*Tasks for stage 1:*  \na) Have a registered and accepted bug found and in the spreadsheet  \nb) Have a write up on your blog where you link to timbu.com \nc) Enter your name on the hng.tech site.  \nOnce all those three are complete, you are eligible for Stage 2. \nHowever, if you are able to write a blog post in a unique domain that no one else has used, you get an automatic promotion to stage 2.";

        default :
            return "I don't recognize your request";
    }
}

module.exports = tasks;