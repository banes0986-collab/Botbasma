const logs = document.getElementById('logs');

function addLog(msg) {
    const p = document.createElement('p');
    p.textContent = `[${new Date().toLocaleTimeString()}] ${msg}`;
    logs.appendChild(p);
    logs.scrollTop = logs.scrollHeight;
}

async function startBots() {
    const ip = document.getElementById('ip').value;
    const count = document.getElementById('count').value;
    
    document.getElementById('targetName').textContent = ip;
    addLog(`Hedefe saldırı başladı: ${ip}`);

    await fetch('/deploy', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ ip, count })
    });
}

async function stopBots() {
    await fetch('/stop', { method: 'POST' });
    addLog("Tüm birimler durduruldu.");
    document.getElementById('botCount').textContent = "0/500";
}
