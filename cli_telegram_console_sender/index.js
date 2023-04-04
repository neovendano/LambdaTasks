const program = require('commander');
const TelegramBot = require('node-telegram-bot-api');

//const token = process.env.TELEGRAM_TOKEN;
const token = '5605303534:AAEKrleF82X-gOYG7JC56Xd4CPu-cx5LPPc';
const bot = new TelegramBot(token, {polling: true});

/*bot.on('message', (msg) => {
    const chatId = msg.chat.id;

    // send a message to the chat acknowledging receipt of their message
    bot.sendMessage(chatId, chatId);
});*/

program
    .name('index')
    .description('CLI to some Telegram string utilities')
    .version('0.1.0');

program.command('message')
    .alias('m')
    .description('Send message via Telegram bot.')
    .argument('<string>', 'Message string')
    .action((str) => {
        bot.sendMessage(653191668, str);
        bot.stopPolling();
    });

program.command('photo')
    .alias('p')
    .description('Send photo via Telegram bot.')
    .argument('<path>', 'Photo path string')
    .action((path) => {
        bot.sendPhoto(653191668, path);
        bot.stopPolling();
    });

program.parse();