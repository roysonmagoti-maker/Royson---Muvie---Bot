const express = require('express');
const TelegramBot = require('node-telegram-bot-api');
const app = express();
app.get('/', (req,res)=> res.send('Royson Bot LIVE'));
app.listen(process.env.PORT || 3000);
const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });
console.log("Royson Search Bot LIVE");

// DATABASE YA MOVIE ZAKO - ONGEZA HAPA KILA MOVIE MPYA!
const MOVIES = {
  "kigodoro": "BAACAgQAAyEFAAMBCwx8vQADAmrDFMJ4Vl4uaJ7fuReSuVVP7CfvAALhJAACr3IhUifrtTp3FAuMPQQ",
  "mtoto wa ajabu": "BAACAgQAAyEFAAMBCwx8vQADAmrDFMJ4Vl4uaJ7fuReSuVVP7CfvAALhJAACr3IhUifrtTp3FAuMPQQ",
  "miujiza": "BAACAgQAAyEFAAMBCwx8vQADAmrDFMJ4Vl4uaJ7fuReSuVVP7CfvAALhJAACr3IhUifrtTp3FAuMPQQ",
  // ONGEZA MOVIE MPYA HAPA CHINI:
  // "maiko": "FILE_ID_MP YA_MAIKO",
  // "single mother": "FILE_ID_MP YA_SINGLE_MOTHER",
};

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

  // Kama ni VIDEO - toa FILE_ID
  if(msg.video || msg.document){
    const fileId = msg.video? msg.video.file_id : msg.document.file_id;
    await bot.sendMessage(chatId, `✅ FILE_ID ya movie hii:\n\n${fileId}\n\nNakili hii uongeze kwenye MOVIES database!`);
    return;
  }

  let text = (msg.text || "").toLowerCase().trim();
  if(text === "/start"){
    await bot.sendMessage(chatId, "Karibu Royson Muvie Search Tz 🎬\n\nAndika jina la movie unayotaka:\nEx: Kigodoro, Maiko, Single Mother, Korea...", MENU);
    return;
  }

  // SEARCH LOGIC
  let foundKey = null;
  for(let key in MOVIES){
    if(text.includes(key)){
      foundKey = key;
      break;
    }
  }

  if(foundKey){
    try{
      await bot.sendMessage(chatId, `🔥 Inatafuta: ${foundKey}...`);
      await bot.sendVideo(chatId, MOVIES[foundKey], {caption: `🎬 ${foundKey}\n🔥 Royson Tafsiri Store\n@RoysonTafsiriStore`});
      await bot.sendMessage(chatId, "✅ Enjoy! Andika movie nyingine!", MENU);
    }catch(e){
      await bot.sendMessage(chatId, "Error: " + e.message);
    }
  } else {
    // HAIJAPATIKANA
    await bot.sendMessage(chatId, `❌ Sijapata movie ya "${msg.text}"\n\nZilizopo kwa sasa:\n- Kigodoro / Mtoto wa ajabu\n\nAndika /start kuona menyu, au njoo Telegram yako uongeze movie mpya!`, MENU);
  }
});

bot.on('callback_query', async (cq) => {
  await bot.sendMessage(cq.message.chat.id, "Andika jina la movie ya " + cq.data + " unayotaka...");
  bot.answerCallbackQuery(cq.id);
});