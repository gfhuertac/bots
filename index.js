// load env variables
require('dotenv').config();

// local libraries
const mib = require('./messenger_iotbot');
const sgb = require('./slack_gitbot');

// 3rd party libraries
const inquirer = require('inquirer');

// menu
const options = ['Enable Slack-GIT bot', 'Disable Slack-GIT bot', 'Enable Messenger-IoT bot', 'Exit'];

// bots
var messenger_bot = null;
var slack_bot = null;

// user interaction
const ui = function() {
  inquirer.prompt([
    {
      type: 'rawlist',
      name: 'bot',
      message: 'What do you want to do?',
      choices: options
    }
  ]).then(function (answer) 
    {
      if (options[0] == answer.bot) {
        sgb.enable(process.env.SLACK_BOT_TOKEN, function(err, bot){
          if (err) return console.log(err);
          slack_bot = bot;
          console.log('slackbot is enabled.');
          ui();
        });
      } else if (options[1] == answer.bot) {
        sgb.disable(slack_bot, function(err){
          if (err) return console.log(err);
          slack_bot = null;
          console.log('slackbot is disabled.');
          ui();
        });
      } else if (options[2] == answer.bot) {
        mib.enable(1080, function(err, bot){
          if (err) return console.log(err);
          messenger_bot = bot;
          console.log('messengerbot is enabled.');
          ui();
        });
      } else {
        sgb.disable(slack_bot, function(err){ process.exit(0); });
      }
    }
  );
};

ui();

