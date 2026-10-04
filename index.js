const express = require('express');
const { Telegraf, Markup } = require('telegraf');
const google = require('googlethis');

const app = express();
const BOT_TOKEN = process.env.BOT_TOKEN;

if (!BOT_TOKEN) {
  console.log("BOT_TOKEN haijawekwa kwenye Render!");
}

const bot = new Telegraf(BOT_TOKEN || '123456:fake');

bot.start((ctx) => ctx.reply('🎬 Karibu Royson Movie Bot!\n\nTuma jina la movie, mfano: John Wick, nitakutafutia Google! 🍿'));

bot.on('text', async (ctx) => {
  const query = ctx.message.text;
  if(query.startsWith('/')) return;
  
  await ctx.reply(`🔍 Natafuta: *${query}* kwenye Google...`, {parse_mode: "Markdown"});
  
  try {
    const response = await google.search(`${query} movie download`, {
      page: 0,
      safe: false
    });
    
    const results = response.results.slice(0, 5);
    
    if(results.length > 0){
      let buttons = [];
      let text = `🎬 *Matokeo ya:* ${query}\n\n`;
      
      results.forEach((r, i) => {
        text += `${i+1}. ${r.title}\n`;
        buttons.push([Markup.button.url(`🔗 Link ${i+1}`, r.url)]);
      });
      
      buttons.push([Markup.button.url('🔎 Tafuta Zaidi Google', `https://www.google.com/search?q=${encodeURIComponent(query + " movie download")}`)]);
      
      await ctx.reply(text, {
        parse_mode: "Markdown",
        ...Markup.inlineKeyboard(buttons)
      });
    } else {
      await ctx.reply('😔 Sijapata matokeo, jaribu jina lingine.');
    }
  } catch(e){
    console.log("Error:", e.message);
    const googleUrl = `https://www.google.com/search?q=${encodeURIComponent(query + " movie download")}`;
    await ctx.reply(`Tatizo kidogo, bofya hapa: ${googleUrl}`, 
      Markup.inlineKeyboard([[Markup.button.url('🔎 Tafuta Google', googleUrl)]])
    );
  }
});

bot.launch().then(() => console.log("Bot started - Google Search")).catch(e => console.log("Bot error:", e.message));

app.get('/', (req, res) => res.send('Royson Movie Bot is LIVE - Google Search Mode 🔥'));
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
