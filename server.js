const express = require('express');
const mineflayer = require('mineflayer');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 10000;

app.use(cors());
app.use(express.json());

let logs = [];
let bot = null;

const addLog = (msg) => {
    const time = new Date().toLocaleTimeString();
    logs.push(`[${time}] ${msg}`);
    if (logs.length > 25) logs.shift();
};

app.get('/terminal-stream', (req, res) => res.json({ logs }));

app.post('/exec-command', (req, res) => {
    const { host, user, auth } = req.body;

    if (auth !== "root123") return res.status(401).send("Unauthorized");
    if (bot) { bot.quit(); addLog("SYSTEM: Previous session terminated."); }

    addLog(`INIT: Connecting to node ${host}...`);

    bot = mineflayer.createBot({
        host: host,
        port: 25565,
        username: user,
        version: "1.20.1", // Sürüm sabitlendi
        hideErrors: false
    });

    bot.on('spawn', () => {
        addLog(`SUCCESS: Session established for ${user}`);
        // Botu aktif tutmak için rastgele hareketler
        setInterval(() => {
            if(bot.entity) {
                bot.setControlState('jump', true);
                setTimeout(() => bot.setControlState('jump', false), 500);
            }
        }, 4000);
    });

    bot.on('chat', (username, message) => addLog(`CHAT: <${username}> ${message}`));
    bot.on('error', (err) => addLog(`CRITICAL: ${err.message}`));
    bot.on('kicked', (reason) => addLog(`DISCONNECT: ${reason}`));

    res.send("Command Received.");
});

app.listen(port, '0.0.0.0', () => console.log("System Ready."));
