const API_URL = "https://botbasma.onrender.com"; // Kendi Render Linkini Buraya Yaz

function log(message, type = 'SYSTEM') {
    const output = document.getElementById('console-output');
    const colors = {
        SYSTEM: 'neon-green',
        ALERT: 'neon-red',
        NETWORK: 'neon-blue',
        BOT: 'neon-teal'
    };
    output.innerHTML += `<br>> [<span class="${colors[type]}">${type}</span>] ${message}`;
    output.scrollTop = output.scrollHeight;
}

// Görseldeki canlı verileri taklit edelim
function updateUI(bots, target, tps) {
    document.getElementById('bot-count').innerText = `${bots}/250`;
    document.getElementById('current-target').innerText = target.toUpperCase();
    document.getElementById('server-tps').innerText = tps.toFixed(1);
}

async function deployBots() {
    const ip = document.getElementById('serverIp').value;
    const count = document.getElementById('botCount').value;

    if(!ip) return alert("TARGET IP IS MANDATORY!");
    updateUI(count, ip, 19.8); // UI'ı güncelle

    log(`Initializing handshake with backend...`, 'SYSTEM');
    log(`Allocating 129GB RAM segments for node network...`, 'SYSTEM');

    try {
        const response = await fetch(`${API_URL}/deploy`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ip, count })
        });
        const data = await response.json();
        log(`SUCCESS: ${data.message}`, 'SYSTEM');
        log(`${ip} sunucusuna bot ordusu daldı!`, 'NETWORK');
    } catch (err) {
        log(`ERROR: Connection to Trigger-Engine failed!`, 'ALERT');
    }
}

function startStress() {
    const ip = document.getElementById('serverIp').value;
    if(!ip) return alert("TARGET IP FIRST!");
    
    log(`[${ip}] için Stress level 4 başlatıldı.`, 'ALERT');
    log(`100 new packet streams established.`, 'NETWORK');
    
    // TPS düşüşünü simüle edelim (Gerçeği Render loglarındadır)
    setTimeout(() => {
        updateUI(200, ip, 14.5);
        log(`Target server TPS drop detected: <span class="neon-red">14.5</span>`, 'ALERT');
    }, 5000);
}

function stopBots() {
    log(`Sending ABORT signal to all active nodes...`, 'NETWORK');
    fetch(`${API_URL}/stop`, { method: 'POST' });
    log(`ATTACK STOPPED. All bots disconnected.`, 'SYSTEM');
    updateUI(0, 'N/A', 20.0);
}

function sendGlobal() {
    const msg = document.getElementById('chatMsg').value;
    log(`[BOT_LEADER] Global message sent: '<span class="neon-blue">${msg}</span>'`, 'BOT');
}
