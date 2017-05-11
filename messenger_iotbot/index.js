// 3rd part libraries
const Botkit = require('botkit');
const co = require('co');
const path = require('path');

// Global variables
const controller = Botkit.facebookbot({
        access_token: process.env.access_token,
        verify_token: process.env.verify_token,
});

// create the slack robot
const bot = controller.spawn({
    token: process.env.SLACK_BOT_TOKEN
});

// methods to be exported

// enable the bot
const enable = function(token, callback) {
    // create the slack robot
    let bot = controller.spawn({
        token: token
    });
    bot.startRTM(function(err){
        if (err) callback(err);
        else callback(null, bot);
    });
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
controller.hears('deploy', ['direct_message','direct_mention','mention'], function(bot, message) {
    co(function *(){
        yield git.fetch(remote, branch).merge(remote, branch);
        bot.reply(message,'done!');
    }).catch(function(err) {
        bot.reply(message, 'an error ocurred. Please deploy manually');
    });
});

module.exports = {
    enable,
    disable
};
