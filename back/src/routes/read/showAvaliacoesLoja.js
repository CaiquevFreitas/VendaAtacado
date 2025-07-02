const express = require('express');
const router = express.Router();
const Avaliacao = require('../../models/avaliacao');
const Produto = require('../../models/produto');
const Cliente = require('../../models/cliente');
const { Op } = require('sequelize');

// GET /avaliacoes/loja/:idLoja
router.get('/avaliacoes/loja/:idLoja', async (req, res) => {
    try {
        const { idLoja } = req.params;
        // Avaliações da loja
        const avaliacoesLoja = await Avaliacao.findAll({
            where: { fk_idLoja: idLoja },
            include: [{ model: Cliente, as: 'Cliente', attributes: ['nomeCliente'] }],
            order: [['idAvaliacao', 'DESC']]
        });
        // Buscar todos os produtos da loja
        const produtos = await Produto.findAll({ where: { fk_idLoja: idLoja }, attributes: ['idProduto', 'nomeProduto'] });
        const idsProdutos = produtos.map(p => p.idProduto);
        // Avaliações dos produtos da loja
        const avaliacoesProdutos = await Avaliacao.findAll({
            where: { fk_idProduto: { [Op.in]: idsProdutos } },
            include: [
                { model: Produto, as: 'Produto', attributes: ['nomeProduto'] },
                { model: Cliente, as: 'Cliente', attributes: ['nomeCliente'] }
            ],
            order: [['idAvaliacao', 'DESC']]
        });
        res.json({ success: true, avaliacoesLoja, avaliacoesProdutos });
    } catch (error) {
        console.error('Erro ao buscar avaliações da loja:', error);
        res.status(500).json({ success: false, message: 'Erro ao buscar avaliações da loja.' });
    }
});

module.exports = router;
