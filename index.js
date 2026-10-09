const TelegramBot = require('node-telegram-bot-api');
const express = require('express');

const token = process.env.BOT_TOKEN;
const app = express();
app.get('/', (req,res)=>res.send('Burudani Live'));
app.listen(process.env.PORT || 3000, ()=>console.log("Server On"));

const bot = new TelegramBot(token, {polling: true});
console.log("Burudani Bot READY");

// Video za mfano - baadaye utabadilisha na link zako
const MOVIES = {
  maigizo: "https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4",
  comedy: "https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4",
  season: "https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4",
  default: "https://sample-videos.com/video321/mp4/720/big_buck_bunny_720p_1mb.mp4"
};

bot.onText(/\/start/, (msg)=>{
  bot.sendMessage(msg.chat.id,
    "🔥 *Karibu Burudani Video Bot* 🎬\n\nAndika tu aina ya burudani:\n- Maigizo\n- Comedy\n- Season\n- Action\n\nAu /movie kupata ya leo!",
    {parse_mode:"Markdown"}
  );
});

bot.onText(/\/movie/, async (msg)=>{
  await bot.sendVideo(msg.chat.id, MOVIES.default, {caption:"🎬 Burudani ya Leo - Enjoy!"});
});

bot.on('message', async (msg)=>{
  const text = msg.text?.toLowerCase();
  if(!text || text.startsWith('/')) return;

  let video = MOVIES.default;
  if(text.includes('maigizo')) video = MOVIES.maigizo;
  else if(text.includes('comedy')) video = MOVIES.comedy;
  else if(text.includes('season')) video = MOVIES.season;

  bot.sendMessage(msg.chat.id, `🔍 Inatafuta *${msg.text}*...`, {parse_mode:"Markdown"});
  setTimeout(()=>{
    bot.sendVideo(msg.chat.id, video, {caption:`🎬 Hapa Burudani yako ya: *${msg.text}* \n\nAndika nyingine 👇`, parse_mode:"Markdown"});
  }, 1000);
});