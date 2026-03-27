const express = require('express');
const mineflayer = require('mineflayer');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 10000;

app.use(cors());
app.use(express.json());

let bot = null;

app.post('/login-execute', (req, res) => {
    const { ip, nick, user, pass } = req.body;

    // SENİN İSTEDİĞİN ŞİFRE KONTROLÜ
    if (user === "admin" && pass === "triger123") {
        if (bot) bot.quit();

        console.log(`ERİŞİM ONAYLANDI: ${ip} hedefine ${nick} gönderiliyor...`);

        bot = mineflayer.createBot({
            host: ip,
            port: 25565,
            username: nick,
            version: "1.20.1",
            hideErrors: true
        });

        bot.on('spawn', () => {
            console.log("BOT İÇERİDE!");
            setInterval(() => {
                if (bot.entity) bot.setControlState('jump', true);
            }, 3000);
        });

        return res.send("SUCCESS");
    } else {
        return res.send("DENIED");
    }
});

app.get('/bot-zipla', (req, res) => res.send("ALIVE"));
app.listen(port, '0.0.0.0');
