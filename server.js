const express = require('express');
const path = require('path');
const mineflayer = require('mineflayer');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

let activeBots = [];

// API: Botları Gönder
app.post('/deploy', (req, res) => {
    const { ip, count } = req.body;
    const botLimit = Math.min(count, 50); // Render Free Tier için güvenli sınır 50'dir

    for (let i = 0; i < botLimit; i++) {
        setTimeout(() => {
            const botName = `Trigger_${Math.floor(Math.random() * 8999) + 1000}`;
            const bot = mineflayer.createBot({
                host: ip,
                username: botName,
                version: false // Otomatik sürüm algılama
            });

            bot.on('login', () => console.log(`${botName} içeri girdi.`));
            bot.on('error', (err) => console.log(`Hata: ${err.message}`));
            
            activeBots.push(bot);
        }, i * 1000); // Sunucu korumasına takılmamak için 1 saniye arayla
    }
    res.json({ success: true, message: `${botLimit} bot başlatıldı.` });
});

// API: Durdur
app.post('/stop', (req, res) => {
    activeBots.forEach(bot => bot.quit());
    activeBots = [];
    res.json({ success: true });
});

app.listen(PORT, () => console.log(`Trigger VIP ${PORT} portunda aktif!`));
