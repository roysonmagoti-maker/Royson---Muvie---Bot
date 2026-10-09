const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const fs = require('fs');
const token = process.env.BOT_TOKEN;
const ADMIN_ID = process.env.ADMIN_ID || "";
const app = express();
app.get('/', (req,res)=>res.send('Burudani Bot Live'));
app.listen(process.env.PORT || 3000);
const bot = new TelegramBot(token, {polling: true});
console.log("🔥 BURUDANI PAY BOT READY - ADMIN:"+ADMIN_ID);

let movies = {};
try{
  if(fs.existsSync('movies.json')){
    movies = JSON.parse(fs.readFileSync('movies.json','utf8') || "{}");
  }
} catch(e){ console.log("DB Error", e); movies = {}; }
function saveMovies(){ fs.writeFileSync('movies.json', JSON.stringify(movies, null, 2)); }

bot.onText(/\/start/, (msg)=>{
  bot.sendMessage(msg.chat.id,
`🔥 *Karibu Burudani Video Bot* 🎬

Andika jina la movie mf:
*Matrix, IP MAN, Mad Max*

Ntakuletea Trailer + Link ya Google.

Admin: /addmovie JINA | LINK TRAILER | FILE_ID`, {parse_mode:"Markdown"});
});

bot.onText(/\/addmovie (.+)/, (msg, match)=>{
  if(ADMIN_ID && msg.from.id.toString()!== ADMIN_ID){
    return bot.sendMessage(msg.chat.id, "❌ Wewe sio Admin. ID yako: "+msg.from.id);
  }
  const parts = match[1].split('|').map(s=>s.trim());
  if(parts.length < 3) return bot.sendMessage(msg.chat.id, "Format: /addmovie Jina | Link Trailer | FileID");
  const [jina, trailer, file] = parts;
  movies[jina.toLowerCase()] = { jina, trailer, file };
  saveMovies();
  bot.sendMessage(msg.chat.id, `✅ Imewekwa: *${jina}*`, {parse_mode:"Markdown"});
});

bot.on('message', async (msg)=>{
  if(!msg.text || msg.text.startsWith('/')) return;
  const chatId = msg.chat.id;
  const text = msg.text;
  const key = text.toLowerCase();
  console.log("Search:", key);

  let foundKey = Object.keys(movies).find(k => key.includes(k) || k.includes(key));
  if(foundKey){
    const m = movies[foundKey];
    await bot.sendMessage(chatId, `🎥 *Trailer ya ${m.jina}:*\n${m.trailer}`, {parse_mode:"Markdown"});
    return bot.sendMessage(chatId, `💰 Full Movie - TZS 1000`, {
      reply_markup:{ inline_keyboard:[ [{text:"💳 LIPIA SASA", callback_data:`pay_${foundKey}`}] ] }
    });
  } else {
    const yt = `https://www.youtube.com/results?search_query=${encodeURIComponent(text+" trailer")}`;
    const gg = `https://www.google.com/search?q=${encodeURIComponent(text+" movie")}`;
    return bot.sendMessage(chatId,
`😔 Sina *${text}* bado.

🔍 Tafuta hapa:
🎬 YouTube Trailer: ${yt}
🌍 Google: ${gg}

Admin ataiongeza hivi karibuni!`, {parse_mode:"Markdown"});
  }
});

bot.on('callback_query', (q)=>{
  bot.sendMessage(q.message.chat.id,
`💰 *Malipo: ${q.data}*
Tigo Pesa: 0655 XXX XXX
Baada ya kulipa tuma /nimelipa`, {parse_mode:"Markdown"});
});