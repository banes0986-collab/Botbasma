const mineflayer = require('mineflayer');
const express = require('express');
const app = express();
app.use(express.json());
app.use(require('cors')());

let bots = [];

app.post('/stress-test', (req, res) => {
    const { ip, count } = req.body;
    const [host, port] = ip.split(':');

    // Botları çok daha hızlı (0.5 saniye arayla) gönderiyoruz
    for (let i = 0; i < Math.min(count, 50); i++) {
        setTimeout(() => {
            const bot = mineflayer.createBot({
                host: host,
                port: parseInt(port) || 25565,
                username: `Tester_${Math.floor(Math.random() * 99999)}`,
                version: "1.20.1"
            });

            bot.on('spawn', () => {
                // Sunucuyu yormak için sürekli zıplama ve etrafa bakma (Packet Spam)
                setInterval(() => {
                    bot.setControlState('jump', true);
                    bot.look(Math.random() * 360, 0);
                    setTimeout(() => bot.setControlState('jump', false), 100);
                }, 500);
            });

            bot.on('error', (err) => console.log(`[!] Test Hatası: ${err.message}`));
            bots.push(bot);
        }, i * 500); 
    }
    res.json({ message: "Yüksek yoğunluklu test başlatıldı!" });
});

app.post('/stop', (req, res) => {
    bots.forEach(b => b.quit());
    bots = [];
    res.json({ message: "Test durduruldu." });
});

app.listen(process.env.PORT || 3000);
