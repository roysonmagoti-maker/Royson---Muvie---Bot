const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');

const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });
const OMDB = process.env.OMDB_KEY;

console.log('Bot started');

bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, '🎬 Karibu Royson! Tuma jina la movie');
});

bot.on('message', async (msg) => {
  if (msg.text.startsWith('/')) return;
  const chatId = msg.chat.id;
  const q = msg.text;

  let title = q, year = '', poster = null, rating = 'N/A', plot = '';
  try {
    const r = await axios.get(`https://www.omdbapi.com/?t=${encodeURIComponent(q)}&apikey=${OMDB}`);
    if (r.data.Response === 'True') {
      title = r.data.Title; year = r.data.Year; rating = r.data.imdbRating; plot = r.data.Plot;
      if (r.data.Poster && r.data.Poster !== 'N/A') poster = r.data.Poster;
    }
  } catch(e){}

  const caption = `🎬 *${title}* ${year}\n⭐ ${rating}\n\n${plot}\n\n👇 DOWNLOAD`;
  const search = encodeURIComponent(title + ' download');

  const keyboard = {
    parse_mode: 'Markdown',
    reply_markup: {
      inline_keyboard: [
        [{text: '⬇️ 720p', url: `https://www.google.com/search?q=${search}+720p`}, {text: '⬇️ 1080p', url: `https://www.google.com/search?q=${search}+1080p`}],
        [{text: '🎬 Trailer', url: `https://www.youtube.com/results?search_query=${encodeURIComponent(title)}+trailer`}],
        [{text: '🔍 Google Download', url: `https://www.google.com/search?q=${search}`}]
      ]
    }
  };

  if (poster) {
    bot.sendPhoto(chatId, poster, {caption, ...keyboard}).catch(()=> bot.sendMessage(chatId, caption, keyboard));
  } else {
    bot.sendMessage(chatId, caption, keyboard);
  }
});