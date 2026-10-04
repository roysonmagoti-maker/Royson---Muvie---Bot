const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');

const BOT_TOKEN = process.env.BOT_TOKEN;
const OMDB_KEY = process.env.OMDB_KEY || 'thewdb';

const bot = new TelegramBot(BOT_TOKEN, { polling: true });

console.log('🔥 Muvie Bot LIVE - Kila kitu kinakuja!');

bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, `🎬 Karibu Royson Muvie Bot!\n\nTuma jina la movie yoyote - nitakuletea:\n✅ Poster\n✅ Maelezo\n✅ DOWNLOAD LINKS 5\n\nMfano: Andika *Avatar*`, {parse_mode:'Markdown'});
});

bot.on('message', async (msg) => {
  if (msg.text.startsWith('/')) return;
  const chatId = msg.chat.id;
  const query = msg.text.trim();
  if (query.length < 2) return;

  try {
    // Pata data ya movie
    const omdbRes = await axios.get(`https://www.omdbapi.com/?t=${encodeURIComponent(query)}&apikey=${OMDB_KEY}`).catch(()=>null);
    const data = omdbRes?.data?.Response === 'True' ? omdbRes.data : null;
    
    const title = data?.Title || query;
    const year = data?.Year || '';
    const rating = data?.imdbRating || 'N/A';
    const plot = data?.Plot || `Movie ya ${title} - bofya download hapa chini`;
    const poster = data?.Poster && data.Poster !== 'N/A' ? data.Poster : null;

    const caption = `🎬 *${title}* ${year ? `(${year})` : ''}\n⭐ Rating: ${rating}/10\n\n📝 ${plot}\n\n👇 *Chagua Download:*`;

    const searchQ = encodeURIComponent(`${title} ${year} download`);
    const searchQ2 = encodeURIComponent(`${title} movie download`);

    const buttons = {
      reply_markup: {
        inline_keyboard: [
          [{text: '⬇️ DOWNLOAD HD 720p', url: `https://www.google.com/search?q=${searchQ}+720p`}, {text: '⬇️ DOWNLOAD 1080p', url: `https://www.google.com/search?q=${searchQ}+1080p`}],
          [{text: '🎬 YouTube Trailer', url: `https://www.youtube.com/results?search_query=${searchQ2}+trailer`}, {text: '🔍 Google Download', url: `https://www.google.com/search?q=${searchQ}`}],
          [{text: '💾 More Sites (YTS)', url: `https://yts.mx/browse-movies/${encodeURIComponent(title)}`}]
        ]
      }
    };

    if (poster) {
      await bot.sendPhoto(chatId, poster, {caption, parse_mode:'Markdown', ...buttons}).catch(async () => {
        await bot.sendMessage(chatId, caption, {parse_mode:'Markdown', ...buttons});
      });
    } else {
      await bot.sendMessage(chatId, caption, {parse_mode:'Markdown', ...buttons});
    }

  } catch (e) {
    console.log(e.message);
    const searchQ = encodeURIComponent(query);
    bot.sendMessage(chatId, `🎬 *${query}*\n\n👇 Download hapa:`, {
      parse_mode:'Markdown',
      reply_markup: {
        inline_keyboard: [
          [{text: '⬇️ DOWNLOAD', url: `https://www.google.com/search?q=${searchQ}+movie+download`}]
        ]
      }
    });
  }
});