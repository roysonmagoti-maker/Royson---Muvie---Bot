
const express = require('express');
const { Telegraf, Markup } = require('telegraf');

const app = express();
const BOT_TOKEN = process.env.BOT_TOKEN;
const bot = new Telegraf(BOT_TOKEN);

bot.start((ctx) => ctx.reply('🎬 Karibu Royson Movie Bot!\n\nTuma jina la movie, mfano: John Wick, nitakutafutia! 🍿'));

bot.on('text', async (ctx) => {
  const query = ctx.message.text;
  if(query.startsWith('/')) return;

  const q = encodeURIComponent(query);
  const qMovie = encodeURIComponent(query + " movie download");

  // Links za movie zitakazofanya kazi kila wakati
  const googleLink = `https://www.google.com/search?q=${qMovie}`;
  const youtubeLink = `https://www.youtube.com/results?search_query=${q}+trailer`;
  const imdbLink = `https://www.imdb.com/find?q=${q}`;

  const text = `🎬 *Matokeo ya:* ${query}\n\n✅ Nimekutafutia kwenye Google. Bonyeza link hapa chini kudownload:\n\n1. 🔗 Google Search - ${query}\n2. 🎥 Trailer YouTube\n3. ⭐ IMDB Info`;

  const buttons = [
    [Markup.button.url(`🔎 Google - ${query}`, googleLink)],
    [Markup.button.url(`🎥 Trailer - ${query}`, youtubeLink)],
    [Markup.button.url(`⭐ IMDB - ${query}`, imdbLink)],
    [Markup.button.url(`📥 Download - ${query}`, `https://www.google.com/search?q=${encodeURIComponent(query + " movie download site:mkvcinemas or site:netnaija or site:moda")}`)]
  ];

  await ctx.reply(text, {
    parse_mode: "Markdown",
    ...Markup.inlineKeyboard(buttons)
  });
});

bot.launch().then(() => console.log("Bot LIVE - Simple Mode")).catch(e => console.log(e));

app.get('/', (req, res) => res.send('Royson Bot LIVE 🔥'));
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server ${PORT}`));