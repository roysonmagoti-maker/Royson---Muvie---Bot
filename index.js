const TelegramBot = require('node-telegram-bot-api');
const express = require('express');

const token = process.env.BOT_TOKEN;
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => res.send('Burudani Video Bot Live!'));
app.listen(PORT, () => console.log(`Server on ${PORT}`));

const bot = new TelegramBot(token, { polling: true });
console.log("Burudani Bot Inawaka...");

// Karibu
bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, 
    "🔥 Karibu Burudani Video Bot! 🎬\n\n" +
    "Andika jina la movie yoyote mfano:\n" +
    "Matrix\nJohn Wick\nAvatar\n\n" +
    "Au andika /movie upate burudani ya leo!"
  );
});

// /movie
bot.onText(/\/movie/, async (msg) => {
  const chatId = msg.chat.id;
  try {
    await bot.sendMessage(chatId, "🎬 Inakuletea burudani...");
    await bot.sendVideo(chatId, "https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4", {
      caption: "🎬 Burudani ya Leo!\n\nAndika jina la movie unayotaka 👇"
    });
  } catch (e) {
    bot.sendMessage(chatId, "Jaribu tena /movie");
  }
});

// Kama mtu akiandika jina la movie (mfano Matrix)
bot.on('message', (msg) => {
  const text = msg.text;
  if (!text || text.startsWith('/')) return; // isirudie /start

  const chatId = msg.chat.id;
  const movie = text.trim();

  bot.sendMessage(chatId, 
    `🔍 Unatafuta: *${movie}* ?\n\n` +
    `Kwa sasa bado tunaunganisha na database ya movies.\n` +
    `Lakini /movie inafanya kazi - jaribu! 🎬\n\n` +
    `Next step tutaunganisha na API ya kweli ya movie.`,
    { parse_mode: 'Markdown' }
  );
});