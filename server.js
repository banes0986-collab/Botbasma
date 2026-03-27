const express = require('express');
const mineflayer = require('mineflayer');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 10000;

app.use(cors());

let bot = null;

app.get('/bot-gonder', (req, res) => {
    const { ip, isim } = req.query;

    // Eğer zaten bir bot varsa onu çıkaralım ki çakışmasın
    if (bot) {
        bot.quit();
    }

    console.log(`${ip} adresine bot gönderiliyor: ${isim}`);

    bot = mineflayer.createBot({
        host: ip,
        port: 25565,
        username: isim,
        version: "1.20.1", // Sunucu sürümün farklıysa burayı değiştir (Örn: "1.16.5")
        hideErrors: true
    });

    bot.on('spawn', () => {
        console.log("BOT BAŞARIYLA GİRDİ!");
        // Botun sunucudan düşmemesi için 2 saniyede bir zıplamasını sağlar
        setInterval(() => {
            if (bot.entity) bot.setControlState('jump', true);
        }, 2000);
    });

    bot.on('error', (err) => console.log("Hata oluştu: " + err.message));
    bot.on('kicked', (reason) => console.log("Bot atıldı: " + reason));

    res.send("Bot gönderim komutu alındı!");
});

app.get('/bot-zipla', (req, res) => res.send("Sistem Aktif"));

app.listen(port, '0.0.0.0', () => {
    console.log("Bot Motoru Hazır!");
});
