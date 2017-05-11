// load env variables
require('dotenv').config();

// local libraries
const sb = require('./slack_gitbot');

// 3rd party libraries
const inquirer = require('inquirer');

// menu
const options = ['Enable Slack-GIT bot', 'Disable Slack-GIT bot', 'Exit'];

// bots
var slack_bot = null;
var which_bot = 'slack';

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
        sb.enable(process.env.SLACK_BOT_TOKEN, function(err, bot){
          if (err) return console.log(err);
          slack_bot = bot;
          console.log(which_bot + ' is enabled.');
          ui();
        });
      } else if (options[1] == answer.bot) {
        sb.disable(slack_bot, function(err){
          if (err) return console.log(err);
          slack_bot = null;
          console.log(which_bot + ' is disabled.');
          ui();
        });
      } else {
        if (slack_bot) sb.disable(slack_bot, function(err){process.exit(0);});
        process.exit(0);
      }
    }
  );
};

ui();

