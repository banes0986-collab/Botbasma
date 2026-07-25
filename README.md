# Minecraft Join Test Botu

Basit bir Minecraft sunucu test botu. Sunucuya bağlanır, katılır ve sonucu loglar.

## Kurulum

```bash
npm install
```

## Kullanım

### 1) Komut satırından

```bash
node bot.js <sunucu_ip> <port> <kullanici_adi> [versiyon]
```

Örnek:
```bash
node bot.js play.crafthosting.com.tr 25565 TestBot
```

### 2) Tarayıcı paneli üzerinden

```bash
npm start
```

Ardından `http://localhost:3000` adresini açın. Sunucu adresi, port ve kullanıcı
adını girip "Testi Başlat" butonuna basınca bot arka planda çalışır ve sonuç
canlı olarak panelde akar.

> Panel yalnızca yerelde/kendi sunucunuzda çalıştırılmak üzere tasarlandı.
> İnternete açık şekilde barındıracaksanız bir kimlik doğrulama katmanı
> eklemeniz önerilir, aksi halde herkes botunuzu tetikleyebilir.

## Notlar

- `auth: 'offline'` sadece offline-mode (cracked) sunucular içindir.
- Online-mode sunucular için `bot.js` içindeki `auth: 'microsoft'` yapılmalı ve gerçek hesap bilgisi girilmelidir.
- Bot spawn olduktan 5 saniye sonra otomatik çıkar.
- 20 saniyede yanıt gelmezse zaman aşımıyla sonlanır.
