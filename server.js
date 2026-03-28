const express = require('express');
const mineflayer = require('mineflayer');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

let activeBots = [];

app.post('/deploy', (req, res) => {
    const { ip, count } = req.body;
    const [host, port] = ip.split(':');

    for (let i = 0; i < Math.min(count, 40); i++) {
        setTimeout(() => {
            const bot = mineflayer.createBot({
                host: host,
                port: parseInt(port) || 25565,
                username: `Trigger_${Math.floor(Math.random() * 8999) + 1000}`,
                version: "1.20.1"
            });

            bot.on('login', () => console.log(`${bot.username} sunucuya sızdı!`));
            bot.on('spawn', () => {
                bot.chat("Trigger VIP v2.0 Aktif!");
                // Anti-AFK: Zıplama
                setInterval(() => { bot.setControlState('jump', true); setTimeout(() => bot.setControlState('jump', false), 500); }, 10000);
            });
            bot.on('error', (err) => console.log("Hata:", err.message));
            
            activeBots.push(bot);
        }, i * 1500);
    }
    res.json({ message: "Botlar sıraya alındı, Render motoru ateşlendi!" });
});

app.post('/stop', (req, res) => {
    activeBots.forEach(b => b.quit());
    activeBots = [];
    res.json({ message: "Operasyon durduruldu." });
});

app.listen(process.env.PORT || 3000, () => console.log("Motor Hazır!"));
