const express = require('express');
const TelegramBot = require('node-telegram-bot-api');

const app = express();
app.get('/', (req,res)=> res.send('Royson Bot Live - Direct Movies'));
app.listen(process.env.PORT || 3000);

const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });
console.log('Royson Bot with DIRECT Movies LIVE');

const CHANNEL_ID = "@RoysonTafsiriStore"; 
const MOVIE_MSG_ID = 2; // Hii ndio ID ya video ya Mtoto wa ajabu. Kama haifanyi kazi badilisha kuwa 1 au 3

const MENU = {
  reply_markup: {
    inline_keyboard: [
      [{text:'🇰🇷 Korea Tafsiri', callback_data:'korea'}, {text:'🇨🇳 China Tafsiri', callback_data:'china'}],
      [{text:'🇳🇬 Nigeria Tafsiri', callback_data:'naija'}, {text:'🇵🇭 Filipino', callback_data:'filipino'}],
      [{text:'🇹🇷 Kituruki Tafsiri', callback_data:'turkey'}, {text:'🇮🇳 Kihindi Tafsiri', callback_data:'india'}],
      [{text:'🎬 Single Movie Tafsiri', callback_data:'single'}],
      [{text:'🎬 Bongo Movie Tafsiri', callback_data:'bongo'}]
    ]
  }
};

bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const text = (msg.text || "").toLowerCase();

  // MANENO YOTE YAKIANDIKWA - TUMA MOVIE DIRECT
  if(text.includes("kigodoro") || text.includes("miujiza") || text.includes("mtoto") || text.includes("ajabu") || text.includes("kituruki") || text.includes("bongo")){
    await bot.sendMessage(chatId, "🔥 Inatumwa... Mtoto wa ajabu (128MB) - Direct bila matangazo!");
    try{
      await bot.copyMessage(chatId, CHANNEL_ID, MOVIE_MSG_ID);
      await bot.sendMessage(chatId, "✅ Imefika! Enjoy Royson Tafsiri Store!", MENU);
    }catch(e){
      await bot.sendMessage(chatId, "❌ Bot bado si Admin kwenye @RoysonTafsiriStore! Nenda Channel > Add Admin > Muvie Search Tz");
    }
    return;
  }

  // Kama ni /start
  if(text === "/start"){
    bot.sendMessage(chatId, "Karibu Royson Muvie Search Tz 🎬\nAndika jina la movie: Kigodoro, Miujiza, Bongo", MENU);
  } else {
    // Search nyingine zote pia peleka direct
    bot.sendMessage(chatId, `🔍 Matokeo ya ${msg.text} :\n\n🎬 Ipo! Bonyeza hapa kutazama DIRECT:`, {
      reply_markup: {
        inline_keyboard: [
          [{text: '▶️ TAZAMA MTOTO WA AJABU (128MB) DIRECT', callback_data: 'direct_movie'}],
          [{text: '⬅️ Menu', callback_data: 'menu'}]
        ]
      }
    });
  }
});

bot.on('callback_query', async (cq) => {
  const chatId = cq.message.chat.id;
  if(cq.data === 'direct_movie' || cq.data === 'bongo' || cq.data === 'turkey' || cq.data === 'single'){
    try{
      await bot.copyMessage(chatId, CHANNEL_ID, MOVIE_MSG_ID);
    }catch(e){
      bot.sendMessage(chatId, "❌ Add bot kama Admin kwenye Channel kwanza!");
    }
  }
  if(cq.data === 'menu'){
    bot.sendMessage(chatId, "Chagua Kategoria:", MENU);
  }
  bot.answerCallbackQuery(cq.id);
});