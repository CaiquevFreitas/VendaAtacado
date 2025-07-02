const express = require('express');
const router = express.Router();
const Produto = require('../../models/produto');
const Loja = require('../../models/loja');
const { Op } = require('sequelize');

router.get('/busca', async (req, res) => {
    try {
        const termo = req.query.termo || '';
        if (!termo || typeof termo !== 'string') {
            return res.json({ produtos: [], lojas: [] });
        }
        // Buscar produtos
        const produtos = await Produto.findAll({
            where: {
                nomeProduto: { [Op.like]: `%${termo}%` }
            },
            limit: 10
        });
        // Buscar lojas
        const lojas = await Loja.findAll({
            where: {
                nomeLoja: { [Op.like]: `%${termo}%` }
            },
            limit: 10
        });
        res.json({ produtos, lojas });
    } catch (error) {
        console.error('Erro na busca:', error);
        res.status(500).json({ produtos: [], lojas: [] });
    }
});

module.exports = router;
