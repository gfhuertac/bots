// 3rd part libraries
const Botkit = require('botkit');
const path = require('path');

// Global variables
const controller = Botkit.slackbot({debug: false});
const git = require('simple-git')( path.resolve(__dirname, "..") );

// methods to be exported

// enable the bot
const enable = function(token, callback) {
  // create the slack robot
  let bot = controller.spawn({
      token: token
  });
  bot.startRTM(callback);
};

// disable the bot
const disable = function(bot, callback) {
  try {
    bot.closeRTM();
    bot.destroy();
    callback();
  } catch (err) {
    callback(err);
  }
};

// the bot will listen for git commands, such as deploy
controller.hears('test', ['direct_message','direct_mention','mention'], function(bot, message) {
  let remote = 'origin';
  let branch = 'master';
  git.pull(remote, branch,{'--rebase': 'true'}).then(function(err) {
    if (err) bot.reply(message, 'an error ocurred. Please deploy manually');
    else bot.reply(message, 'done!');
  });
});

module.exports = {
  enable,
  disable
};
