const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());

app.get('/', (req, res) => {
    res.json({ message: 'Bienvenue sur l\'API', version: '1.0.0' });
});

app.get('/health', (req, res) => {
    res.json({ status: 'ok', version: '1.0.0' });
});

app.listen(PORT, () => {
    console.log(`API v1 démarrée sur le port ${PORT}`);
});