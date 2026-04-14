const express = require('express');
const app = express();
const cors = require('cors');

app.use(cors());
app.use(express.json());

let protectionStatus = "Pasif";

// Korumayı Aktif Etme
app.post('/api/protection/toggle', (req, res) => {
    const { mail, password, status } = req.body;
    
    // Senin bilgilerinle doğrulama
    if (mail === 'triggerbaba31@gmail.com' && password === 'trigger3163') {
        protectionStatus = status ? "Aktif" : "Pasif";
        console.log(`[SYSTEM] Koruma Modu Değişti: ${protectionStatus}`);
        res.json({ success: true, message: `Koruma ${protectionStatus} hale getirildi.` });
    } else {
        res.status(403).json({ success: false, message: "Yetkisiz erişim!" });
    }
});

app.listen(3000, () => console.log("Kontrol Paneli API'si 3000 portunda çalışıyor."));
