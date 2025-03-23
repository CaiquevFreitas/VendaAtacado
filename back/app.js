const express =  require('express');
const port = 3000;
const cors = require('cors');
const dotenv = require('dotenv');
const db = require('./src/models/database');

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
    res.send('API funcionando!');
});

app.listen(3000, () => {
    console.log(`Servidor rodando: https://localhost:${port}`);
});
