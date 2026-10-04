const express = require('express');
const { Telegraf } = require('telegraf');

const app = express();
const BOT_TOKEN = process.env.BOT_TOKEN;

if (!BOT_TOKEN) {
  console.log("BOT_TOKEN haijawekwa kwenye Render!");
}

const bot = new Telegraf(BOT_TOKEN || '123456:fake');

bot.start((ctx) => ctx.reply('🎬 Karibu Royson Movie Bot! Tuma jina la movie.'));
bot.on('text', (ctx) => {
  ctx.reply(`Umetafuta: ${ctx.message.text}\n\nBot iko LIVE! 🎉`);
});

bot.launch().then(() => console.log("Bot started")).catch(e => console.log("Bot error:", e.message));

app.get('/', (req, res) => res.send('Royson Movie Bot is LIVE!'));
app.get('/health', (req, res) => res.send('OK'));

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Server on ${PORT}`));
