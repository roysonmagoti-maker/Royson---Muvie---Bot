const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');

const token = process.env.BOT_TOKEN;
const bot = new TelegramBot(token, { polling: true });

console.log("Bot ya Royson inawaka...");

bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, "Habari! Bot iko tayari. 🎬\nAndika /movie upate movie ya burudani!");
});

bot.onText(/\/movie/, async (msg) => {
  try {
    // Video ya burudani ya mfano
    await bot.sendVideo(msg.chat.id, "https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4", {
      caption: "🎬 Burudani ya leo! Enjoy Royson Movie Bot"
    });
  } catch (e) {
    bot.sendMessage(msg.chat.id, "Subiri kidogo... video inakuja");
  }
});