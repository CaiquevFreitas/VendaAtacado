const express =  require('express');
const port = 3000;
const cors = require('cors');
const dotenv = require('dotenv');
const db = require('./src/models/database');
dotenv.config();
const app = express();
app.use(cors({
    origin: 'exp://192.168.176.214:8081',
    methods: ['GET', 'POST', 'DELETE', 'PUT'],
    allowedHeaders: ['Content-Type']
}))
app.use(express.json());
app.use(express.urlencoded({extended:true}))

//Importação das Rotas
const cadastroclienteRoute = require('./src/routes/cadastroCliente')
const loginCliente = require('./src/routes/loginCliente')
const cadastroLoja = require('./src/routes/cadastroLoja')
const loginLoja = require('./src/routes/loginLoja')


app.use('/', cadastroclienteRoute);
app.use('/', loginCliente);
app.use('/', cadastroLoja);
app.use('/', loginLoja);

app.listen(3000, () => {
    console.log(`Servidor rodando: http://localhost:${port}`);
});
