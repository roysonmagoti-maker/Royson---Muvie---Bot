const TelegramBot = require('node-telegram-bot-api');
const TOKEN = process.env.BOT_TOKEN;
const MPESA = process.env.MPESA_NUMBER || '0792747560';
const ADMIN_ID = process.env.ADMIN_ID || ''; // weka ID yako ya Telegram hapa

const bot = new TelegramBot(TOKEN, { polling: false });

// MAKTABA YAKO TOSHA - Ongeza movie hapa tu, itakuja na picha yenyewe
const movies = {
  "ip man": {
    title: "IP MAN",
    trailer: "https://youtu.be/1hPp59RvhS8",
    poster: "https://image.tmdb.org/t/p/w500/2lECpi35Hnbpa4y46JX0aY3AWTyT.jpg",
    price: 1000
  },
  "mad max": {
    title: "Mad Max Fury Road",
    trailer: "https://youtu.be/hEJnMQG9ev8",
    poster: "https://image.tmdb.org/t/p/w500/8tZYtuWezp8JbcsvHYO0O46tFboT.jpg",
    price: 1000
  },
  "john wick": {
    title: "John Wick 4",
    trailer: "https://youtu.be/qEVU3r4ESvs",
    poster: "https://image.tmdb.org/t/p/w500/vZloFAK7NmvMGKE7VkF5UHaz0I.jpg",
    price: 1000
  },
  "avatar": {
    title: "Avatar The Way of Water",
    trailer: "https://youtu.be/d9MyW72ELq0",
    poster: "https://image.tmdb.org/t/p/w500/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg",
    price: 1000
  }
};

module.exports = async (req, res) => {
  try {
    const body = req.body;
    if (!body.message) return res.status(200).send('ok');
    
    const chatId = body.message.chat.id;
    const text = (body.message.text || '').toLowerCase().trim();
    const originalText = body.message.text || '';

    // 1. MTEJA AKIJIUNGA /start - KARIBU MAKTABA
    if (text === '/start') {
      await bot.sendMessage(chatId, 
`🔥 KARIBU BURUDANI VIDEO BOT 🔥

Maktaba Tosha ya Movie Kali!

Andika jina la movie unayotaka mfano:
👉 IP MAN
👉 Mad Max
👉 John Wick
👉 Avatar

Au bonyeza /movies kuona zote.

💰 Movie zote TZS ${movies["ip man"].price} tu! 
Malipo: M-Pesa ${MPESA}`,
      { parse_mode: 'Markdown' });
      return res.status(200).send('ok');
    }

    // 2. ORODHA YA MOVIE ZOTE
    if (text === '/movies' || text === 'movies') {
      let list = "🎬 MAKTABA YETU:\n\n";
      Object.values(movies).forEach(m => list += `🎥 ${m.title}\n`);
      list += `\nAndika jina la movie kupata picha + trailer!`;
      await bot.sendMessage(chatId, list);
      return res.status(200).send('ok');
    }

    // 3. NIMELIPA - INAFANYA KAZI KWA HERUFI ZOTE
    if (text === '/nimelipa' || text === 'nimelipa' || text === '/nimelipa'.toLowerCase()) {
      await bot.sendMessage(chatId,
`✅ Asante! Tuma Screenshot ya muamala hapa.

Admin atathibitisha na kukutumia movie moja kwa moja.

📱 Namba uliyolipia: M-Pesa ${MPESA}`);

      if (ADMIN_ID) {
        await bot.sendMessage(ADMIN_ID, `🔔 MTEJA AMELIPA!\nChat ID: ${chatId}\nJina: ${body.message.from.first_name}\nMuamala: ${originalText}`);
      }
      return res.status(200).send('ok');
    }

    // 4. KUTAFUTA MOVIE - INAKUJA NA PICHA!
    const foundKey = Object.keys(movies).find(k => text.includes(k));
    
    if (foundKey) {
      const m = movies[foundKey];
      // TUMA PICHA + MAELEZO
      await bot.sendPhoto(chatId, m.poster, {
        caption: `🎬 *${m.title}*\n\n🎥 Trailer: ${m.trailer}\n\n💰 Full Movie TZS ${m.price}\n💵 Malipo: M-Pesa ${MPESA}\n\nBaada ya kulipa bonyeza /nimelipa`,
        parse_mode: 'Markdown',
        reply_markup: {
          inline_keyboard: [
            [{ text: "🎬 Tazama Trailer", url: m.trailer }],
            [{ text: "💰 LIPIA SASA", callback_data: "lipia" }]
          ]
        }
      });
      return res.status(200).send('ok');
    }

    // 5. HAKUNA MOVIE
    if (text && !text.startsWith('/')) {
       await bot.sendMessage(chatId, `😔 Sina *${originalText}* bado.\n\nAndika /movies kuona movie zilizopo maktaba.\n\nTrailer YouTube: https://www.youtube.com/results?search_query=${encodeURIComponent(originalText)}+trailer`, {parse_mode: 'Markdown'});
    }

    res.status(200).send('ok');
  } catch (e) {
    console.error(e);
    res.status(200).send('ok');
  }
};