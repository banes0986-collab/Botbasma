const API_URL = "https://botbasma.onrender.com"; // Render adresini buraya yaz

function log(message) {
    const output = document.getElementById('console-output');
    output.innerHTML += `<br>> ${message}`;
    output.scrollTop = output.scrollHeight;
}

async function deployBots() {
    const ip = document.getElementById('serverIp').value;
    const count = document.getElementById('botCount').value;

    if(!ip) return alert("HEDEF IP YAZILMADI!");

    log(`Initializing packet stream to ${ip}...`);
    log(`Allocating 129GB RAM segments...`);

    try {
        const response = await fetch(`${API_URL}/deploy`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ip, count })
        });
        const data = await response.json();
        log(`SUCCESS: ${data.message}`);
    } catch (err) {
        log(`ERROR: Connection to Trigger-Engine failed!`);
    }
}

async function stopBots() {
    log(`Sending ABORT signal...`);
    await fetch(`${API_URL}/stop`, { method: 'POST' });
    log(`ATTACK STOPPED.`);
}
