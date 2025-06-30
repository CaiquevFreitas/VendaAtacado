const express = require('express');
const ItemCarrinho = require('../../models/itemCarrinho');
const router = express.Router();

router.post('/adicionarAoCarrinho', async (req, res) => {
    const { idCarrinho, idProduto, quantidade, precoUnitario } = req.body;
    console.log(req.body)
    if (!idCarrinho || !idProduto || !quantidade || !precoUnitario) {
        return res.status(400).json({ message: 'Dados obrigatórios não enviados.' });
    }
    try {
        const novoItem = await ItemCarrinho.create({
            fk_idCarrinho: idCarrinho,
            fk_idProduto: idProduto,
            quantidade,
            precoUnitario
        });
        return res.status(201).json({ message: 'Item adicionado ao carrinho!', item: novoItem });
    } catch (error) {
        console.error('Erro ao adicionar item ao carrinho:', error);
        return res.status(500).json({ message: 'Erro ao adicionar item ao carrinho.' });
    }
});

module.exports = router;
