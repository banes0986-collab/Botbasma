async function check() {
    const ip = document.getElementById("ip").value;
    const res = await fetch(`/status?ip=${ip}`);
    const data = await res.json();

    if (data.online) {
        document.getElementById("statusBox").innerHTML =
            `Status: 🟢 Online <br>
             Players: ${data.players}/${data.max} <br>
             Ping: ${data.ping} ms`;
    } else {
        document.getElementById("statusBox").innerHTML =
            "🔴 Offline";
    }
}

function vip() {
    document.getElementById("vipStatus").innerText =
        "VIP aktiv edildi ✅ (demo)";
}

function stress() {
    document.getElementById("stressStatus").innerText =
        "Stress test başladı... (simulyasiya)";
}
