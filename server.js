# BingX Trading Bot (Node.js)

## Popis
Tento repozitář obsahuje jednoduchého **BingX Trading Bota**, který běží na **Render.com**.

## Struktura projektu:
- **server.js** → Hlavní backendový soubor (Express.js API)
- **package.json** → Závislosti projektu
- **.env** → API klíče a konfigurace (nutno přidat ručně)
- **Dockerfile** → Konfigurace pro běh na Renderu

---

## Jak nasadit na Render:
1. **Vytvoř GitHub repozitář** a nahraj soubory.
2. **Na Render.com vyber „New Web Service“ a připoj GitHub.**
3. **Vyber runtime „Node.js“ a nastav environment variables.**
4. **Klikni na Deploy – bot poběží automaticky!**

---

## Instalace a spuštění lokálně
```bash
npm install
node server.js
```

---

## Připojení k BingX API
### 1️⃣ Instalace balíčku pro HTTP požadavky
Bot bude komunikovat s BingX API pomocí knihovny `axios`. Přidáme ji do `package.json`:
```bash
npm install axios crypto
```

### 2️⃣ Úprava `server.js` pro získání dat z BingX
Přidáme připojení k API a základní endpoint pro získání ceny BTC/USDT.

```javascript
const express = require('express');
const axios = require('axios');
require('dotenv').config();
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 3000;

// BingX API klíče
const API_KEY = process.env.BINGX_API_KEY;
const API_SECRET = process.env.BINGX_API_SECRET;
const BASE_URL = 'https://api.bingx.com/api/v1';

// Funkce pro získání aktuální ceny BTC/USDT
app.get('/price', async (req, res) => {
    try {
        const response = await axios.get(`${BASE_URL}/market/ticker?symbol=BTC-USDT`);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Chyba při načítání ceny BTC' });
    }
});

// Funkce pro vytvoření podpisu API requestu
const createSignature = (params) => {
    const query = Object.keys(params).sort().map(key => `${key}=${params[key]}`).join('&');
    return crypto.createHmac('sha256', API_SECRET).update(query).digest('hex');
};

// Funkce pro vytvoření testovací objednávky
app.post('/order', async (req, res) => {
    try {
        const params = {
            symbol: 'BTC-USDT',
            side: 'BUY',
            type: 'LIMIT',
            quantity: 0.01,
            price: 50000,
            timestamp: Date.now()
        };
        params.signature = createSignature(params);

        const response = await axios.post(`${BASE_URL}/order`, null, {
            headers: { 'X-BX-APIKEY': API_KEY },
            params
        });
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Chyba při vytváření objednávky' });
    }
});

app.listen(PORT, () => {
    console.log(`Server běží na portu ${PORT}`);
});
```

---

### 3️⃣ Konfigurace API klíčů v `.env`
Do souboru `.env` přidej API klíče:
```plaintext
PORT=3000
BINGX_API_KEY=TVUJ_API_KLIC
BINGX_API_SECRET=TVUJ_SECRET
```

---

## To-Do List:
✅ Přidat základní API pro BingX
✅ Implementovat řízení hedge
✅ Připojení k BingX API
⬜ Automatizované sledování volatility
⬜ Připojení k UI

---

📌 **Další kroky:**
- Přidej API klíče do `.env`
- Testuj napojení na BingX API přes endpoint `/price`
- Otestuj vytvoření objednávky `/order`
- Optimalizuj strategii podle volatility
