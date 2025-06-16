const express =  require('express');
const port = 3000;
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();
const app = express();
app.use(cors({
    origin: 'http://localhost:8081',
    methods: ['GET', 'POST', 'DELETE', 'PUT'],
    allowedHeaders: ['Content-Type']
}))
app.use(express.json());
app.use(express.urlencoded({extended:true}))

// Configuração para servir arquivos estáticos da pasta uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

//Importação das Rotas
const cadastroclienteRoute = require('./src/routes/create/cadastroCliente')
const loginCliente = require('./src/routes/loginCliente')
const cadastroLoja = require('./src/routes/create/cadastroLoja')
const loginLoja = require('./src/routes/loginLoja')
const editLoja = require('./src/routes/update/editLoja')
const cadastrarProduto = require('./src/routes/create/cadastrarProduto')

app.use('/', cadastroclienteRoute);
app.use('/', loginCliente);
app.use('/', cadastroLoja);
app.use('/', loginLoja);
app.use('/', editLoja);
app.use('/', cadastrarProduto);

app.listen(3000, () => {
    console.log(`Servidor rodando: http://localhost:${port}`);
});
