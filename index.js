const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const axios = require('axios');

const token = process.env.BOT_TOKEN;
const app = express();
const PORT = process.env.PORT || 3000;

// Ili Render isilale
app.get('/', (req, res) => res.send('Royson Movie Bot is Running!'));
app.listen(PORT, () => console.log(`Server on ${PORT}`));

const bot = new TelegramBot(token, { polling: true });

console.log("Bot ya Royson inawaka...");

bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, "Habari! Bot iko tayari. 🎬\nAndika /movie upate movie ya burudani!");
});

bot.onText(/\/movie/, async (msg) => {
  try {
    await bot.sendMessage(msg.chat.id, "🎬 Burudani ya leo inakuja...");
    await bot.sendVideo(msg.chat.id, "https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4", {
      caption: "🎬 Burudani ya leo! Enjoy Royson Movie Bot"
    });
  } catch (e) {
    console.log(e.message);
    bot.sendMessage(msg.chat.id, "Video imeshindwa, jaribu tena /movie");
  }
});