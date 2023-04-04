const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');

const API_KEY = process.env.API_TOKEN;

const bot = new TelegramBot(process.env.TELEGRAM_TOKEN, { polling: true });

let weatherForecastData = null;
let monoExchangeData = null;
const replyKeyboard = {
    keyboard: [
        [{ text: 'Weather in Kyiv' }],
        [{ text: 'Exchange rate'}]
    ],
    resize_keyboard: true,
    one_time_keyboard: true
};

bot.onText(/\/start/, (msg) => {
    bot.sendMessage(msg.chat.id, 'Welcome to MageBot!', { reply_markup: replyKeyboard });
});

bot.onText(/Weather in Kyiv/, (msg) => {
    bot.sendMessage(msg.chat.id, 'Choose period:', {
        reply_markup: {
            keyboard: [
                [{ text: 'Weather forecast each 3 hours' }],
                [{ text: 'Weather forecast each 6 hours' }],
                [{ text: 'Previous menu' }]
            ],
            resize_keyboard: true,
            one_time_keyboard: true
        }
    });
});

bot.onText(/Exchange rate/, (msg) => {
    bot.sendMessage(msg.chat.id, 'Choose period:', {
        reply_markup: {
            keyboard: [
                [{ text: 'USD' }],
                [{ text: 'EUR' }],
                [{ text: 'Previous menu' }]
            ],
            resize_keyboard: true,
            one_time_keyboard: true
        }
    });
});


bot.onText(/(Weather forecast each 3 hours|Weather forecast each 6 hours)/, async (msg, match) => {
    const period = match[1];
    let response;

    try {
        const url = `https://api.openweathermap.org/data/2.5/forecast?q=Kyiv&appid=${API_KEY}`;
        const { data } = await axios.get(url);
        response = data;
        weatherForecastData = response;
        setTimeout(() => {
            weatherForecastData = null;
        }, 60000);
    } catch (err) {
        if (weatherForecastData) {
            response = weatherForecastData;
        } else {
            console.error(err);
            bot.sendMessage(msg.chat.id, 'Failed to get weather data.', { reply_markup: replyKeyboard });
            return;
        }
    }

    let message = `${response.city.name}, ${response.city.country}\n\n`;
    const forecasts = response.list.filter((item, index) => {
        return (period === 'Weather forecast each 3 hours') || (period === 'Weather forecast each 6 hours' && index % 2 === 0);
    });
    let forecastDate = new Date(1);
    forecasts.forEach((forecast) => {
        const date = new Date(forecast.dt * 1000);
        if (date.toDateString() !== forecastDate.toDateString()) {
            forecastDate = date;
            message += `\n${date.toDateString()}:\n\n`;
        }
        const time = `${date.getHours().toString().padStart(2, '0')}:00`;
        const realTemperature = parseInt(forecast.main.temp - 273.15);
        const feelTemperature = parseInt(forecast.main.feels_like - 273.15);
        const weather = forecast.weather[0].description;
        message += `${time}:    ${realTemperature}°C, feels like ${feelTemperature}°C, ${weather}\n`;
    });

    bot.sendMessage(msg.chat.id, message, { reply_markup: replyKeyboard });
});

bot.onText(/(EUR|USD)/, async (msg, match) => {
    const currency = match[1];
    let privatResponse;
    let monoResponse;

    const privatUrl = `https://api.privatbank.ua/p24api/pubinfo?json&exchange&coursid=5`;
    const { data } = await axios.get(privatUrl);
    privatResponse = data;
    let privatExchangeData = privatResponse;

    try {
        const monoUrl = `https://api.monobank.ua/bank/currency`;
        const { data } = await axios.get(monoUrl);
        monoResponse = data;
        monoExchangeData = monoResponse;
    } catch (err) {
        if (monoExchangeData) {
            monoResponse = monoExchangeData;
        } else {
            console.error(err);
            bot.sendMessage(msg.chat.id, 'Failed to get exchange rate data.', { reply_markup: replyKeyboard });
            return;
        }
    }

    let message = ``;
    if (currency === 'USD'){
        message = `USD\n\nPrivatBank:\n`;
        let privatBuy = privatExchangeData[1].buy;
        let privatSale = privatExchangeData[1].sale;
        message += `Buy: ${privatBuy} UAH   Sale: ${privatSale} UAH\n`;

        for(let mono in monoResponse){
            if (monoResponse[mono].currencyCodeA === 840 && monoResponse[mono].currencyCodeB === 980){
                message += `MonoBank:\n`;
                let monoBuy = monoResponse[mono].rateBuy;
                let monoSell = monoResponse[mono].rateSell;
                message += `Buy: ${monoBuy} UAH   Sale: ${monoSell} UAH\n`;
            }
        }
    }
    else if (currency === 'EUR'){
        message = `EUR\n\nPrivatBank:\n`;
        let privatBuy = privatExchangeData[0].buy;
        let privatSale = privatExchangeData[0].sale;
        message += `Buy: ${privatBuy} UAH   Sale: ${privatSale} UAH`;

        for(let mono in monoResponse){
            if (monoResponse[mono].currencyCodeA === 978 && monoResponse[mono].currencyCodeB === 980){
                message += `MonoBank:\n`;
                let monoBuy = monoResponse[mono].rateBuy;
                let monoSell = monoResponse[mono].rateSell;
                message += `Buy: ${monoBuy} UAH   Sale: ${monoSell} UAH\n`;
            }
        }
    }

    bot.sendMessage(msg.chat.id, message, { reply_markup: replyKeyboard });
});

bot.onText(/Previous menu/, (msg) => {
    bot.sendMessage(msg.chat.id, `Going back`, { reply_markup: replyKeyboard });
});