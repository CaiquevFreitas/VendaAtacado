const express =  require('express');
const port = 3000;
const cors = require('cors');
const dotenv = require('dotenv');
const db = require('./src/models/database');

dotenv.config();

const app = express();
app.use(cors({
    origin: 'exp://192.168.1.7:8081',
    methods: ['GET', 'POST', 'DELETE', 'PUT'],
    allowedHeaders: ['Content-Type']
}))
app.use(express.json());
app.use(express.urlencoded({extended:true}))

app.get('/', (req, res) => {
    res.send('API funcionando!');
});

app.post('/cadastroCliente', (req,res) =>{
    console.log("Dados recebidos: ", req.body)
})

app.listen(3000, () => {
    console.log(`Servidor rodando: http://localhost:${port}`);
});
