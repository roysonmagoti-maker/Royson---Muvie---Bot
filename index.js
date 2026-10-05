const express = require('express');
const TelegramBot = require('node-telegram-bot-api');
const app = express();
app.get('/', (req,res)=> res.send('Royson Bot Live'));
app.listen(process.env.PORT || 3000);

const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });
console.log('Royson Bot with Categories LIVE');

const MENU = {
  reply_markup: {
    inline_keyboard: [
      [{text:'🇰🇷 Korea Tafsiri', callback_data:'korea'}, {text:'🇨🇳 China Tafsiri', callback_data:'china'}],
      [{text:'🇳🇬 Nigeria Tafsiri', callback_data:'naija'}, {text:'🇵🇭 Filipino', callback_data:'filipino'}],
      [{text:'🇹🇷 Kituruki Tafsiri', callback_data:'turkey'}, {text:'🇮🇳 Kihindi Tafsiri', callback_data:'india'}],
      [{text:'🎬 Single Movie Tafsiri', callback_data:'single'}],
      [{text:'🔥 Series Mpya 2024', callback_data:'series'}],
      [{text:'🔍 Tafuta Jina', callback_data:'search'}]
    ]
  }
};

const LINKS = {
  korea: 'https://swahiliflix.com/category/korean-drama/',
  china: 'https://swahiliflix.com/category/chinese-drama/',
  naija: 'https://swahiliflix.com/?s=nigeria+tafsiri',
  filipino: 'https://swahiliflix.com/?s=filipino+tafsiri',
  turkey: 'https://swahiliflix.com/category/turkish-drama/',
  india: 'https://swahiliflix.com/category/indian-movies/',
  single: 'https://swahiliflix.com/category/movies/',
  series: 'https://swahiliflix.com/category/series/'
};

bot.onText(/\/start/, (msg)=>{
  bot.sendMessage(msg.chat.id, `🎬 *MUVIE SEARCH TZ - ROYSON* 🔥\n\nKaribu ${msg.from.first_name}!\n\nHapa utapata zote zilizotafsiriwa Kiswahili 👇\n\n🇰🇷 Korea | 🇨🇳 China | 🇹🇷 Uturuki | 🇮🇳 Kihindi\n🇳🇬 Nigeria | 🇵🇭 Filipino | 🎬 Single\n\n*Chagua aina:*`, {parse_mode:'Markdown', ...MENU});
});

bot.on('callback_query', (q)=>{
  const id = q.message.chat.id;
  const d = q.data;
  if(LINKS[d]){
    bot.sendMessage(id, `🎬 *${d.toUpperCase()} TAFSIRI* \n\nBonyeza hapa kuingia na kudownload moja kwa moja 👇\n\nKuna 100+ zimetafsiriwa!`, {
      parse_mode:'Markdown',
      reply_markup:{ inline_keyboard: [
        [{text:`⬇️ FUNGUA ${d.toUpperCase()}`, url: LINKS[d]}],
        [{text:'⬅️ Rudi Menu', callback_data:'back'}]
      ]}
    });
  }
  if(d==='back') bot.sendMessage(id, "🏠 Menu Kuu:", MENU);
  if(d==='search') bot.sendMessage(id, "✍️ Andika jina la movie, mfano:\n`Squid Game`\n`Luna` \n`Ip Man`");
});

bot.on('message', (msg)=>{
  if(!msg.text || msg.text.startsWith('/')) return;
  if(msg.text.length < 2) return;
  // Kama mtu ameandika jina
  if(!Object.keys(LINKS).includes(msg.text)){
    let t = encodeURIComponent(msg.text + ' tafsiri');
    bot.sendMessage(msg.chat.id, `🔍 Matokeo ya *${msg.text}* :`, {
      parse_mode:'Markdown',
      reply_markup:{ inline_keyboard: [
        [{text:'🎬 Swahiliflix (Tafsiri)', url:`https://swahiliflix.com/?s=${t}`}],
        [{text:'▶️ YouTube Tafsiri', url:`https://www.youtube.com/results?search_query=${t}`}],
        [{text:'🌍 Google Tafsiri', url:`https://www.google.com/search?q=${t}+swahili+tafsiri`}],
        [{text:'⬅️ Menu', callback_data:'back'}]
      ]}
    });
  }
});