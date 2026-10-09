const TelegramBot = require('node-telegram-bot-api');

const TOKEN = process.env.BOT_TOKEN;
const MPESA = process.env.MPESA_NUMBER || '0792747560';

if (!TOKEN) {
  console.error("BOT_TOKEN missing!");
  process.exit(1);
}

const bot = new TelegramBot(TOKEN, { polling: true });
console.log("🔥 Burudani Bot LIVE na Maktaba na Picha!");

const movies = {
  "ip man": { title: "IP MAN", poster: "https://image.tmdb.org/t/p/w500/2lECpi35Hnbpa4y46JX0aY3AWTyT.jpg", trailer: "https://youtu.be/1hPp59RvhS8", price: 1000 },
  "mad max": { title: "Mad Max Fury Road", poster: "https://image.tmdb.org/t/p/w500/8tZYtuWezp8JbcsvHYO0O46tFboT.jpg", trailer: "https://youtu.be/hEJnMQG9ev8", price: 1000 },
  "john wick": { title: "John Wick 4", poster: "https://image.tmdb.org/t/p/w500/vZloFAK7NmvMGKE7VkF5UHaz0I.jpg", trailer: "https://youtu.be/qEVU3r4ESvs", price: 1000 },
  "avatar": { title: "Avatar 2", poster: "https://image.tmdb.org/t/p/w500/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg", trailer: "https://youtu.be/d9MyW72ELq0", price: 1000 }
};

bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const text = (msg.text || '').toLowerCase().trim();

  if (text === '/start') {
    return bot.sendMessage(chatId, `🔥 KARIBU BURUDANI VIDEO BOT 🔥\n\nMaktaba Tosha!\nAndika jina la movie:\n👉 IP MAN\n👉 Mad Max\n👉 John Wick\n\n💰 TZS 1000 tu! M-Pesa ${MPESA}\nAndika /movies kuona zote.`);
  }

  if (text === '/movies') {
    let list = "🎬 MAKTABA YETU:\n\n";
    Object.values(movies).forEach(m => list += `🎥 ${m.title}\n`);
    return bot.sendMessage(chatId, list + "\nAndika jina upate PICHA + TRAILER!");
  }

  if (text === '/nimelipa' || text === 'nimelipa') {
    return bot.sendMessage(chatId, `✅ Asante! Tuma Screenshot ya muamala hapa.\nNamba uliyolipia: M-Pesa ${MPESA}`);
  }

  const foundKey = Object.keys(movies).find(k => text.includes(k));
  if (foundKey) {
    const m = movies[foundKey];
    return bot.sendPhoto(chatId, m.poster, {
      caption: `🎬 *${m.title}*\n\n🎥 Trailer: ${m.trailer}\n💰 TZS ${m.price}\n💵 M-Pesa ${MPESA}\n\nBaada ya kulipa /nimelipa`,
      parse_mode: 'Markdown',
      reply_markup: {
        inline_keyboard: [
          [{ text: "🎬 Tazama Trailer", url: m.trailer }],
          [{ text: "💰 LIPIA SASA", callback_data: "lipia" }]
        ]
      }
    });
  }
});

bot.on('polling_error', (err) => console.log(err));