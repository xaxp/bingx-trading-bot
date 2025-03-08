const express = require('express');
const axios = require('axios');
require('dotenv').config();
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 3000;

// BingX API klíče
const API_KEY = process.env.BINGX_API_KEY;
const API_SECRET = process.env.BINGX_API_SECRET;
const BASE_URL = 'https://demo-api.bingx.com/api/v1';

// Funkce pro získání aktuální ceny BTC/USDT
app.get('/price', async (req, res) => {
    try {
        console.log("Fetching BTC price from BingX API...");
        const response = await axios.get(`${BASE_URL}/market/ticker?symbol=BTC-USDT`);
        console.log("API Response:", response.data);
        res.json(response.data);
    } catch (error) {
        console.error("BingX API Error:", error.response ? error.response.data : error.message);
        res.status(500).json({ 
            error: 'Chyba při načítání ceny BTC', 
            details: error.response ? error.response.data : error.message 
        });
    }
});

// Funkce pro vytvoření podpisu API requestu
const createSignature = (params) => {
    const query = Object.keys(params).sort().map(key => `${key}=${params[key]}`).join('&');
    return crypto.createHmac('sha256', API_SECRET).update(query).digest('hex');
};

// Funkce pro vytvoření bezpečné testovací objednávky s minimální velikostí
app.post('/order', async (req, res) => {
    try {
        const params = {
            symbol: 'BTC-USDT',
            side: 'BUY',
            type: 'LIMIT',
            quantity: 0.0001, // Minimální možná velikost obchodu
            price: 10000, // Nízká cena pro testovací účely
            leverage: 1, // Nejnižší možná páka
            timestamp: Date.now()
        };
        params.signature = createSignature(params);

        const response = await axios.post(`${BASE_URL}/order`, null, {
            headers: { 'X-BX-APIKEY': API_KEY },
            params
        });
        res.json(response.data);
    } catch (error) {
        console.error("BingX API Order Error:", error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'Chyba při vytváření objednávky', details: error.response ? error.response.data : error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server běží na portu ${PORT}`);
});
