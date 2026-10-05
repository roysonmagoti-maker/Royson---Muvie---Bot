const express = require('express');
const TelegramBot = require('node-telegram-bot-api');
const app = express();
app.get('/', (req,res)=> res.send('Bot Live'));
app.listen(process.env.PORT || 3000);

const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });
console.log("Bot LIVE - Direct Mode");

// Hii ni FILE_ID ya Mtoto wa ajabu - tutaipata sasa hivi
let MOVIE_FILE_ID = null;
let MOVIE_CAPTION = "🎬 Mtoto wa ajabu (128MB) - Royson Tafsiri Store";

bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  
  // Kama umetuma VIDEO yenyewe kwa bot - itahifadhi FILE_ID
  if(msg.video || msg.document){
    const fileId = msg.video ? msg.video.file_id : msg.document.file_id;
    await bot.sendMessage(chatId, `✅ FILE_ID ya movie hii ni:\n\n${fileId}\n\nNakili hii uibandike kwenye code!`);
    console.log("FILE_ID:", fileId);
    MOVIE_FILE_ID = fileId;
    return;
  }

  const text = (msg.text || "").toLowerCase();
  
  if(text.includes("kigodoro") || text.includes("mtoto") || text.includes("ajabu") || text.includes("miujiza")){
    if(MOVIE_FILE_ID){
      await bot.sendVideo(chatId, MOVIE_FILE_ID, {caption: MOVIE_CAPTION});
    } else {
      // Bado hatujaihifadhi - tuma maelekezo
      await bot.sendMessage(chatId, "⚠️ Bado sijaihifadhi movie!\n\nTuma kwanza hiyo video ya Mtoto wa ajabu 128MB HAPA KWENYE BOT kama file/video, sio kwenye Channel. Nikishai-pata nitaituma direct kwa kila mtu!");
    }
  } else if(msg.text === "/start"){
    await bot.sendMessage(chatId, "Karibu Royson Muvie Search Tz 🎬\nAndika: Kigodoro au Mtoto wa ajabu");
  }
});