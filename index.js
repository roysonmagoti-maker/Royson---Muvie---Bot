const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const fs = require('fs');

const token = process.env.BOT_TOKEN;
const ADMIN_ID = process.env.ADMIN_ID; // ID yako ya Telegram
const app = express();
app.get('/', (req,res)=>res.send('Burudani Bot Live'));
app.listen(process.env.PORT || 3000);

const bot = new TelegramBot(token, {polling: true});
console.log("🔥 BURUDANI PAY BOT READY");

// Database rahisi - itatunza movie zako
let movies = {};
try{ movies = JSON.parse(fs.readFileSync('movies.json')); } catch(e){ movies = {}; }
function saveMovies(){ fs.writeFileSync('movies.json', JSON.stringify(movies, null, 2)); }

// START
bot.onText(/\/start/, (msg)=>{
  bot.sendMessage(msg.chat.id,
`🔥 *Karibu Burudani Video Bot* 🎬

Andika jina la movie yoyote mf:
*Matrix, IP MAN, Mad Max*

Bot itakuletea Trailer kwanza, ukipenda unalipia kupata Full Movie.

Admin: /addmovie - kuweka movie mpya`, {parse_mode:"Markdown"});
});

// ADMIN - KUWEKA MOVIE
// Matumizi: /addmovie Matrix | https://youtube.com/trailer | https://t.me/channel/123
bot.onText(/\/addmovie (.+)/, (msg, match)=>{
  if(msg.from.id.toString()!== ADMIN_ID){
    return bot.sendMessage(msg.chat.id, "❌ Wewe sio Admin");
  }
  const parts = match[1].split('|').map(s=>s.trim());
  if(parts.length < 3) return bot.sendMessage(msg.chat.id, "Format: /addmovie Jina | Link ya Trailer | Link ya Movie/ FileID");

  const [jina, trailer, file] = parts;
  movies[jina.toLowerCase()] = { jina, trailer, file, price: 1000 };
  saveMovies();
  bot.sendMessage(msg.chat.id, `✅ Movie imewekwa: *${jina}*`, {parse_mode:"Markdown"});
});

// USER SEARCH - Kila kitu
bot.on('message', async (msg)=>{
  const chatId = msg.chat.id;
  const text = msg.text;
  if(!text || text.startsWith('/')) return;

  const key = text.toLowerCase();

  // 1. TAFUTA KWENYE DATABASE YAKO
  let foundKey = Object.keys(movies).find(k => key.includes(k) || k.includes(key));

  if(foundKey){
    const m = movies[foundKey];
    await bot.sendMessage(chatId, `🎬 *Inatafuta ${m.jina}...*`, {parse_mode:"Markdown"});

    // Tuma Trailer
    await bot.sendMessage(chatId, `🎥 *Trailer ya ${m.jina}:*\n${m.trailer}\n\nHii ni muonekano tu.`, {parse_mode:"Markdown"});

    // Leta Button ya Kulipia
    return bot.sendMessage(chatId, `💰 Unataka Full Movie ya *${m.jina}*?\nBei: TZS 1,000\n\nBonyeza kulipia:`, {
      parse_mode:"Markdown",
      reply_markup:{
        inline_keyboard:[
          [{text:"💳 LIPIA SASA - TZS 1000", callback_data:`pay_${foundKey}`}],
          [{text:"📞 Wasiliana na Admin", url:"https://t.me/Royson_admin"}] // badilisha username yako
        ]
      }
    });
  } else {
    // 2. KAMA HAIPO - TUMA GOOGLE / YOUTUBE
    const googleLink = `https://www.google.com/search?q=${encodeURIComponent(text + " movie trailer")}`;
    const youtubeLink = `https://www.youtube.com/results?search_query=${encodeURIComponent(text + " trailer")}`;

    return bot.sendMessage(chatId,
`😔 Samahani, sina movie ya *${text}* kwenye database bado.

Lakini nimekutafutia hapa:

🎬 *Trailer YouTube:*
${youtubeLink}

🔍 *Google:*
${googleLink}

Andika jina lingine au subiri Admin aiongeze.`, {parse_mode:"Markdown"});
  }
});

// PAYMENT BUTTON
bot.on('callback_query', async (query)=>{
  const chatId = query.message.chat.id;
  const data = query.data;

  if(data.startsWith('pay_')){
    const key = data.replace('pay_','');
    const m = movies[key];

    // HAPA NDIYO SEHEMU YA MALIPO - KWA SASA MANUAL
    await bot.sendMessage(chatId,
`💰 *Malipo ya ${m.jina}*

1. Tuma TZS 1000 kwenda:
   *Tigo Pesa: 0655 XXX XXX* (weka namba yako)
   *M-Pesa: 0755 XXX XXX*

2. Baada ya kutuma, tuma Screenshot hapa au Andika /nimelipa ${m.jina}

Mara ukithibitisha utatumiwa Movie moja kwa moja!`, {parse_mode:"Markdown"});

    // Kama una FileID ya Telegram, itatuma moja kwa moja hapa
    // await bot.sendDocument(chatId, m.file);
  }
});

// Admin kuthibitisha malipo
bot.onText(/\/tuma (.+)/, (msg, match)=>{
  if(msg.from.id.toString()!== ADMIN_ID) return;
  const parts = match[1].split(' ');
  const userId = parts[0];
  const movieKey = parts.slice(1).join(' ').toLowerCase();
  const m = movies[movieKey];
  if(!m) return bot.sendMessage(msg.chat.id, "Movie haijapatikana");

  bot.sendMessage(userId, `✅ Malipo yako yamethibitishwa! Hapa movie yako:`);
  bot.sendVideo(userId, m.file, {caption:`🎬 ${m.jina} - Enjoy!`}); // au sendDocument
  bot.sendMessage(msg.chat.id, "Imetumwa!");
});