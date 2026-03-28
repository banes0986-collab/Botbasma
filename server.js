const express = require('express');
const mineflayer = require('mineflayer');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 10000;

app.use(cors());

let bot = null;

app.get('/spawn-bot', (req, res) => {
    const { ip, nick } = req.query;

    if (bot) {
        bot.quit();
        console.log("Önceki bot çıkarıldı.");
    }

    // IP:PORT ayırma işlemi
    const host = ip.split(':')[0];
    const port = parseInt(ip.split(':')[1]) || 25565;

    console.log(`BAGLANTI: ${host}:${port} | NICK: ${nick}`);

    bot = mineflayer.createBot({
        host: host,
        port: port,
        username: nick,
        version: "1.20.1", // Sunucu sürümünle aynı olmalı
        hideErrors: false
    });

    bot.on('spawn', () => {
        console.log("BAŞARILI: Bot sunucuya giriş yaptı!");
        // Botun oyunda kalması için sürekli zıplama
        setInterval(() => {
            if (bot.entity) {
                bot.setControlState('jump', true);
                setTimeout(() => bot.setControlState('jump', false), 500);
            }
        }, 3000);
    });

    bot.on('chat', (username, message) => {
        console.log(`<${username}> ${message}`);
    });

    bot.on('error', (err) => console.log("HATA: " + err.message));
    bot.on('kicked', (reason) => console.log("ATILDI: " + reason));

    res.send("BOT_YOLA_CIKTI");
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Bot Motoru ${PORT} Portunda Hazır.`);
});
