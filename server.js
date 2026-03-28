const express = require('express');
const mineflayer = require('mineflayer');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 10000;

app.use(cors());

let bot = null;

app.get('/bot-gonder', (req, res) => {
    const { ip, isim } = req.query;

    // Eğer zaten bir bot varsa, yeni komutta eskisini temizle
    if (bot) {
        bot.quit();
        console.log("Eski bot çıkarılıyor...");
    }

    console.log(`Hedef: ${ip} | Bot İsmi: ${isim}`);

    bot = mineflayer.createBot({
        host: ip,
        port: 25565,
        username: isim,
        version: "1.20.1",
        hideErrors: true
    });

    bot.on('spawn', () => {
        console.log("BOT SUNUCUYA GIRDI!");
        // Botun AFK kalması ve düşmemesi için 3 saniyede bir zıplama
        setInterval(() => {
            if (bot.entity) bot.setControlState('jump', true);
        }, 3000);
    });

    bot.on('error', (err) => console.log("Hata: " + err.message));
    bot.on('kicked', (reason) => console.log("Bot atıldı: " + reason));

    res.send("Sinyal Gönderildi");
});

app.get('/bot-zipla', (req, res) => res.send("System Active"));

app.listen(port, '0.0.0.0', () => {
    console.log("Sunucu 10000 portunda hazır.");
});
