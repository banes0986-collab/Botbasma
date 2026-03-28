// BURASI ÇOK ÖNEMLİ: Kendi Render linkini buraya tırnak içine yaz!
const API_URL = "https://botbasma.onrender.com"; 

async function startBots() {
    const ip = document.getElementById('ip').value;
    const count = document.getElementById('count').value;
    
    // Konsola yazdır
    addLog(`Hedef belirlendi: ${ip}. Botlar hazırlanıyor...`, 'sys');

    // Render'a emir gönder
    try {
        const response = await fetch(`${API_URL}/deploy`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ ip: ip, count: parseInt(count) })
        });
        const data = await response.json();
        addLog(`Sistem Mesajı: ${data.message}`, 'sys');
    } catch (error) {
        addLog("Hata: Render sunucusuna ulaşılamadı. Uyanmasını bekle!", "err");
    }
}
