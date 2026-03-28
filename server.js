const express = require("express");
const mc = require("minecraft-server-util");

const app = express();
app.use(express.static("public"));

app.get("/status", async (req, res) => {
    const ip = req.query.ip;

    try {
        const result = await mc.status(ip, 25565);
        res.json({
            online: true,
            players: result.players.online,
            max: result.players.max,
            ping: result.roundTripLatency
        });
    } catch {
        res.json({ online: false });
    }
});

app.listen(3000, () => console.log("⚡ Neon Panel Active"));
