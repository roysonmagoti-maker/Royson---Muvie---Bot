const TelegramBot = require('node-telegram-bot-api');

const BOT_TOKEN = process.env.BOT_TOKEN;
const OMDB_KEY = process.env.OMDB_KEY || 'thewdb';

const bot = new TelegramBot(BOT_TOKEN, { polling: true });
console.log('BOT LIVE FIXED');

bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, `🎬 Karibu Royson Muvie Bot!\nTuma jina la movie mfano: Avatar`);
});

bot.on('message', async (msg) => {
  if (msg.text.startsWith('/')) return;
  const chatId = msg.chat.id;
  const query = msg.text.trim();
  if (query.length < 2) return;

  try {
    let title = query, year = '', rating = 'N/A', plot = '', poster = null;
    
    try {
      const res = await fetch(`https://www.omdbapi.com/?t=${encodeURIComponent(query)}&apikey=${OMDB_KEY}`);
      const data = await res.json();
      if (data.Response === 'True') {
        title = data.Title; year = data.Year; rating = data.imdbRating; plot = data.Plot; 
        if (data.Poster && data.Poster !== 'N/A') poster = data.Poster;
      }
    } catch(e){}

    const caption = `🎬 *${title}* ${year ? '('+year+')' : ''}\n⭐ ${rating}/10\n\n${plot}\n\n👇 DOWNLOAD:`;

    const q = encodeURIComponent(title + ' ' + year + ' download');
    const q2 = encodeURIComponent(title + ' movie download');

    const opts = {
      parse_mode: 'Markdown',
      reply_markup: {
        inline_keyboard: [
          [{text: '⬇️ HD 720p', url: `https://www.google.com/search?q=${q}+720p`}, {text: '⬇️ HD 1080p', url: `https://www.google.com/search?q=${q}+1080p`}],
          [{text: '🎬 Trailer', url: `https://www.youtube.com/results?search_query=${encodeURIComponent(title)}+trailer`}, {text: '🔍 Google', url: `https://www.google.com/search?q=${q2}`}],
          [{text: '💾 YTS Download', url: `https://yts.mx/browse-movies/${encodeURIComponent(title)}`}]
        ]
      }
    };

    if (poster) {
      await bot.sendPhoto(chatId, poster, {caption, ...opts}).catch(()=> bot.sendMessage(chatId, caption, opts));
    } else {
      await bot.sendMessage(chatId, caption, opts);
    }
  } catch (err) {
    console.log(err);
  }
});