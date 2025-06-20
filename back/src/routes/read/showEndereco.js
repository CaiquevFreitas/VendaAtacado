const express = require('express');
const Endereco = require('../../models/endereco');
const router = express.Router();

router.get('/endereco/:fk_idLoja', async (req, res) => {
    try {
        const { fk_idLoja } = req.params;
        const endereco = await Endereco.findOne({ where: { fk_idLoja } });
        if (!endereco) {
            return res.status(404).json({ message: 'Endereço não encontrado para esta loja.' });
        }
        res.json({ endereco });
    } catch (error) {
        console.error('Erro ao buscar endereço:', error);
        res.status(500).json({ message: 'Erro ao buscar endereço', error: error.message });
    }
});

module.exports = router; 