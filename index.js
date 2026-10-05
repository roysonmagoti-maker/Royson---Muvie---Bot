const express = require('express');
const TelegramBot = require('node-telegram-bot-api');
const app = express();
app.get('/', (req,res)=> res.send('Royson Bot LIVE Direct'));
app.listen(process.env.PORT || 3000);

const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });
console.log("ROyson Bot Direct Movie LIVE");

// FILE_ID yako ya Mtoto wa ajabu 128MB - YA KUDUMU!
const MOVIE_FILE_ID = "BAACAgQAAyEFAAMBCwx8vQADAmrDFMJ4Vl4uaJ7fuReSuVVP7CfvAALhJAACr3IhUifrtTp3FAuMPQQ";
const MOVIE_CAPTION = "🎬 Mtoto wa ajabu (128MB)\n\n🔥 Royson Tafsiri Store - Tafsiri Kali!\n@RoysonTafsiriStore";

const MENU = {
  reply_markup: {
    inline_keyboard: [
      [{text:'🇰🇷 Korea', callback_data:'korea'}, {text:'🇨🇳 China', callback_data:'china'}],
      [{text:'🇳🇬 Nigeria', callback_data:'naija'}, {text:'🇵🇭 Filipino', callback_data:'filipino'}],
      [{text:'🇹🇷 Kituruki', callback_data:'turkey'}, {text:'🇮🇳 Kihindi', callback_data:'india'}],
      [{text:'🎬 Bongo Movie', callback_data:'bongo'}]
    ]
  }
};

bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const text = (msg.text || "").toLowerCase();

  // KILA MTU AKIANDIKA KIGODORO / MTOTO / MIUJIZA - TUMA DIRECT!
  if(text.includes("kigodoro") || text.includes("kigodolo") || text.includes("mtoto") || text.includes("ajabu") || text.includes("miujiza") || text.includes("bongo") || text.includes("kituruki")){
    try{
      await bot.sendMessage(chatId, "🔥 Inatumwa... Mtoto wa ajabu (128MB) DIRECT!");
      await bot.sendVideo(chatId, MOVIE_FILE_ID, {caption: MOVIE_CAPTION});
      await bot.sendMessage(chatId, "✅ Imefika! Enjoy Royson Tafsiri Store! Andika movie nyingine!", MENU);
    }catch(e){
      await bot.sendMessage(chatId, "Error: " + e.message);
    }
    return;
  }

  if(text === "/start"){
    await bot.sendMessage(chatId, "Karibu Royson Muvie Search Tz 🎬\n\nAndika jina la movie:\n- Kigodoro\n- Mtoto wa ajabu\n- Miujiza\n\nNitakutumia DIRECT bila matangazo!", MENU);
  }
});

bot.on('callback_query', async (cq) => {
  const chatId = cq.message.chat.id;
  try{
    await bot.sendVideo(chatId, MOVIE_FILE_ID, {caption: MOVIE_CAPTION});
  }catch(e){
    await bot.sendMessage(chatId, "Error: " + e.message);
  }
  bot.answerCallbackQuery(cq.id);
});