const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const mineflayer = require("mineflayer");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: "secretkey",
    resave: false,
    saveUninitialized: true
}));

// Login page
app.get("/", (req, res) => {
    if (req.session.loggedIn) {
        res.send(`
        <h2>AFK Bot Panel</h2>
        <form action="/start" method="post">
            Server IP: <input name="ip"><br>
            Bot Name: <input name="name"><br>
            <button type="submit">Start Bot</button>
        </form>
        `);
    } else {
        res.send(`
        <h2>Login</h2>
        <form action="/login" method="post">
            Password: <input type="password" name="password"><br>
            <button type="submit">Login</button>
        </form>
        `);
    }
});

// Login check
app.post("/login", (req, res) => {
    if (req.body.password === "trigger123") {
        req.session.loggedIn = true;
    }
    res.redirect("/");
});

// Start bot
app.post("/start", (req, res) => {
    if (!req.session.loggedIn) return res.redirect("/");

    const ip = req.body.ip;
    const name = req.body.name;

    const bot = mineflayer.createBot({
        host: ip,
        username: name,
        version: "1.20.1"
    });

    bot.on("spawn", () => {
        console.log(name + " joined and is AFK.");
    });

    bot.on("error", err => console.log(err));
    bot.on("end", () => console.log(name + " disconnected"));

    res.send("Bot started!");
});

app.listen(3000, () => {
    console.log("Panel running on http://localhost:3000");
});
