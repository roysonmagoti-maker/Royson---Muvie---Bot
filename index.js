const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const fs = require('fs');
const token = process.env.BOT_TOKEN;
const ADMIN_ID = process.env.ADMIN_ID || "";
const app = express();
app.get('/', (req,res)=> res.send('Bot Live'));
app.listen(process.env.PORT || 3000);
const bot = new TelegramBot(token, {polling: true});
console.log("BOT STARTED ADMIN:"+ADMIN_ID);

let movies = {};
try{
 if(fs.existsSync('movies.json')){
   movies = JSON.parse(fs.readFileSync('movies.json','utf8') || '{}');
 }
}catch(e){ movies = {}; }
function saveMovies(){
 fs.writeFileSync('movies.json', JSON.stringify(movies,null,2));
}

bot.onText(/\/start/, (msg)=>{
 bot.sendMessage(msg.chat.id, "🔥 Karibu Burudani Video Bot\n\nAndika jina la movie mf: Matrix, IP MAN, Mad Max\n\nAdmin: /addmovie JINA | LINK | FILE_ID");
});

bot.onText(/\/addmovie (.+)/, (msg, match)=>{
 if(ADMIN_ID && msg.from.id.toString()!== ADMIN_ID.toString()){
   return bot.sendMessage(msg.chat.id, "Sio Admin. ID yako: "+msg.from.id);
 }
 let parts = match[1].split('|').map(s=>s.trim());
 if(parts.length < 3) return bot.sendMessage(msg.chat.id, "Format: /addmovie Jina | Link Trailer | FileID");
 let [jina, trailer, file] = parts;
 movies[jina.toLowerCase()] = {jina, trailer, file};
 saveMovies();
 bot.sendMessage(msg.chat.id, "✅ Imewekwa: "+jina);
});

bot.on('message', (msg)=>{
 if(!msg.text || msg.text.startsWith('/')) return;
 let key = msg.text.toLowerCase();
 let foundKey = Object.keys(movies).find(k => key.includes(k) || k.includes(key));
 if(foundKey){
   let m = movies[foundKey];
   bot.sendMessage(msg.chat.id, "🎥 Trailer ya "+m.jina+":\n"+m.trailer);
   bot.sendMessage(msg.chat.id, "💰 Full Movie TZS 1000", {
     reply_markup:{inline_keyboard:[[{text:"LIPIA SASA", callback_data:"pay_"+foundKey}]]}
   });
 }else{
   let yt = "https://www.youtube.com/results?search_query="+encodeURIComponent(msg.text+" trailer");
   bot.sendMessage(msg.chat.id, "😔 Sina "+msg.text+" bado.\nTrailer YouTube: "+yt);
 }
});

bot.on('callback_query', (q)=>{
 bot.sendMessage(q.message.chat.id, "💰 Malipo: Tigo Pesa 0655 XXX XXX\nBaada ya kulipa /nimelipa");
});