const express = require("express");
const app = express();
const port = 3000;

const mc = require("minecraft-server-util");

app.use(express.static("public"));

app.get("/status", async (req, res) => {
    const ip = req.query.ip;
    try {
        const result = await mc.status(ip, 25565);
        res.json({
            online: true,
            players: result.players.online,
            max: result.players.max,
            motd: result.motd.clean
        });
    } catch (e) {
        res.json({ online: false });
    }
});

app.listen(port, () => {
    console.log("Server başladı");
});
