// local libraries
const sh = require('./smart_home');

// 3rd part libraries
const Botkit = require('botkit');
const co = require('co');
const path = require('path');

// Global variables
const controller = Botkit.facebookbot({
  access_token: process.env.FACEBOOK_BOT_ACCESS_TOKEN,
  verify_token: process.env.FACEBOOK_BOT_VERIFY_TOKEN,
});

// methods to be exported

// enable the bot
const enable = function(port, callback) {
  controller.setupWebserver(port, function(err, webserver) {
    if (err) return callback(err);
    // create the msgr robot
    let bot = controller.spawn({ });
    controller.createWebhookEndpoints(controller.webserver, bot, function(err) {
      callback(err, bot);
    });
  });
};

// disable the bot
const disable = function(bot, callback) {
  callback();
};

// the bot will listen for git commands, such as deploy
controller.hears(['hello'], 'message_received', function(bot, message) {
  bot.reply(message, 'papaletas');
});

// the bot will listen for iot commands
controller.hears(['open', 'sesame'], 'message_received', function(bot, message) {
  sh.fd_open(function(err) {
    if (err) {
      console.log(err);
      bot.reply(message, 'I could not open the door for you');
    }
    else bot.reply(message, 'done!');
  });
});

module.exports = {
  enable,
  disable
};
