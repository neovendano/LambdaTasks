const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');

const token = process.env.TELEGRAM_TOKEN;
const bot = new TelegramBot(token, {polling: true});

bot.on('message', (msg) => {
    const chatId = msg.chat.id;
    const messageText = msg.text;

    if (messageText.toLowerCase() === 'photo') {
        axios.get('https://picsum.photos/200/300', { responseType: 'arraybuffer' })
            .then((response) => {
                bot.sendPhoto(chatId, response.data, { caption: 'Random photo' });
            })
            .catch((error) => {
                console.error(error);
                bot.sendMessage(chatId, 'Failed to get photo');
            });
    } else {
        bot.sendMessage(chatId, messageText);
    }
});