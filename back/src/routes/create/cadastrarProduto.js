const express = require('express');
const Produto = require('../../models/produto');
const router = express.Router();

router.post('/cadastrarProduto', (req, res) => {
    const { nomeProduto, categoria, preco, estoque } = req.body;
});

module.exports = router;