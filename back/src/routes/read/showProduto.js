const express = require('express');
const router = express.Router();
const Produto = require('../../models/Produto');

router.get('/showProduto/:lojaId', async (req, res) => {
    try {
        const { lojaId } = req.params;
        
        if (!lojaId) {
            return res.status(400).json({ error: 'ID da loja é obrigatório' });
        }

        const produtos = await Produto.findAll({ where: { fk_idLoja: lojaId } });
        res.json(produtos);
    } catch (error) {
        console.error('Erro ao buscar produtos:', error);
        res.status(500).json({ error: 'Erro ao buscar produtos' });
    }
});

module.exports = router;