import express from 'express';
const port = 3000;
import cors from 'cors';
import dotenv from 'dotenv';
import database from './models/database'

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
    res.send('API funcionando!');
});

app.listen(port, () => {
    console.log(`Servidor rodadando http://localhost:${port}`);
});
