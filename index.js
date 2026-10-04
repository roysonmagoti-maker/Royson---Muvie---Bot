const express = require('express');
const { Telegraf } = require('telegraf');

const app = express();
const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start((ctx) => {
  return ctx.reply('🎬 Karibu Royson Movie Bot!\nTuma jina la movie kama: Avatar, Avengers, John Wick');
});

bot.on('text', async (ctx) => {
  try {
    const query = ctx.message.text;
    if (query.startsWith('/')) return;

    const q = encodeURIComponent(query);
    const googleUrl = `https://www.google.com/search?q=${q}+movie+download`;
    
    await ctx.reply(`🎬 Matokeo ya: ${query}\n\n✅ Bonyeza hapa chini:`, {
      reply_markup: {
        inline_keyboard: [
          [{ text: `🔎 Google - ${query}`, url: googleUrl }],
          [{ text: `🎥 Trailer - ${query}`, url: `https://www.youtube.com/results?search_query=${q}+trailer` }],
          [{ text: `⭐ IMDB - ${query}`, url: `https://www.imdb.com/find?q=${q}` }],
          [{ text: `📥 Download - ${query}`, url: `https://www.google.com/search?q=${q}+site:netnaija` }]
        ]
      }
    });
  } catch (e) {
    console.log(e);
  }
});

bot.launch().then(() => console.log("Bot LIVE")).catch(e => console.log(e));

app.get('/', (req, res) => res.send('Bot LIVE'));
app.listen(process.env.PORT || 3000, () => console.log('Server on'));
