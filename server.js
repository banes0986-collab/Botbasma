const express = require('express');
const mineflayer = require('mineflayer');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 10000;

app.use(cors());

let bot = null;

app.get('/bot-gonder', (req, res) => {
    const { ip, isim } = req.query;

    if (bot) {
        bot.quit();
        console.log("Eski bot çıkarıldı.");
    }

    console.log(`Hedef: ${ip} | Bot: ${isim}`);

    bot = mineflayer.createBot({
        host: ip,
        port: 25565,
        username: isim,
        version: "1.20.1",
        hideErrors: true
    });

    bot.on('spawn', () => {
        console.log("BOT OYUNA GIRDI!");
        // Botun aktif kalması için zıplama
        setInterval(() => {
            if (bot.entity) bot.setControlState('jump', true);
        }, 3000);
    });

    bot.on('error', (err) => console.log("Hata: " + err.message));
    bot.on('kicked', (reason) => console.log("Atıldı: " + reason));

    res.send("Komut iletildi.");
});

app.get('/bot-zipla', (req, res) => res.send("OK"));

app.listen(port, '0.0.0.0', () => {
    console.log("Sistem Hazır!");
});
