const mineflayer = require('mineflayer');
const express = require('express');
const app = express();
app.use(express.json());
app.use(require('cors')());

let activeBots = [];

app.post('/deploy', (req, res) => {
    const { ip, count } = req.body;
    const botCount = Math.min(count, 50); // Güvenli limit

    for (let i = 0; i < botCount; i++) {
        setTimeout(() => {
            const bot = mineflayer.createBot({
                host: ip.split(':')[0],
                port: ip.split(':')[1] || 25565,
                username: `TriggerVIP_${Math.floor(Math.random()*8999)+1000}`,
                version: "1.20.1"
            });

            bot.on('login', () => console.log(`${bot.username} Girdi!`));
            bot.on('spawn', () => bot.chat("Trigger VIP Aktif!"));
            bot.on('error', (err) => console.log("Hata: " + err.message));
            
            activeBots.push(bot);
        }, i * 1200);
    }
    res.json({ message: "Saldırı... Pardon, Operasyon Başlatıldı!" });
});

app.post('/stop', (req, res) => {
    activeBots.forEach(b => b.quit());
    activeBots = [];
    res.json({ message: "Tüm botlar geri çekildi." });
});

app.listen(process.env.PORT || 3000);
