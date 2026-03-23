const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());

app.get('/', (req, res) => {
    res.json({ message: 'Bienvenue sur l\'API', version: '2.0.0' });
});

app.get('/health', (req, res) => {
    res.json({ status: 'ok', version: '1.0.0' });
});

app.get('/users', (req, res) => {
    res.json({ users: [{ id: 1, name: 'Axel' }, { id: 2, name: 'Manon' }] });
});

app.get('/products', (req, res) => {
    res.json({ items: [{ id: 1, label: 'Téléphone' }, { id: 2, label: 'Clavier' }] });
});

app.listen(PORT, () => {
    console.log(`API v1 démarrée sur le port ${PORT}`);
});