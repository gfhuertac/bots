// local libraries
const sh = require('./smart_home');

// 3rd part libraries
const Acl = require('acl');
const Botkit = require('botkit');
const co = require('co');
const path = require('path');

// Global variables
const access_control = new Acl(new Acl.memoryBackend());
const controller = Botkit.facebookbot({
  access_token: process.env.FACEBOOK_BOT_ACCESS_TOKEN,
  verify_token: process.env.FACEBOOK_BOT_VERIFY_TOKEN,
});

// loads the access control list
access_control.addUserRoles('1385564591538464', 'family');
access_control.allow('family', ['front_door'], 'open');

// initializes the smart home interface
sh.sh_init(function(err) {
  if (err) console.log(err);
});

// error handling method
const handle_error = function(err, bot, message, reason) {
  console.log(err);
  if (bot && message)
    bot.reply(message, 'I could not open the door for you. ' + (reason || ''));
};

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
controller.hears(['open'], 'message_received', function(bot, message) {
  const user = message.user;
  access_control.isAllowed(user, 'front_door', 'open', function(err, res){
    if (err) handle_error(err, bot, message);
    if(res){
      sh.fd_open(function(err) {
        if (err) handle_error(err, bot, message);
        else bot.reply(message, 'done!');
      });
    } else
      handle_error(err, bot, message, 'Not authorized');
  })
});

module.exports = {
  enable,
  disable
};
