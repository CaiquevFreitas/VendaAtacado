const express = require('express');
const router = express.Router();
const Notificacao = require('../../models/notificacao');

// Buscar notificações de um cliente
router.get('/cliente/:idCliente', async (req, res) => {
    try {
        const { idCliente } = req.params;
        
        const notificacoes = await Notificacao.findAll({
            where: { fk_idCliente: idCliente },
            order: [['dataNotificacao', 'DESC']],
            attributes: ['idNotificacao', 'titulo', 'descricao', 'tipo', 'dataNotificacao', 'fk_idCliente']
        });

        res.json(notificacoes);
    } catch (error) {
        console.error('Erro ao buscar notificações do cliente:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

// Buscar notificações de uma loja
router.get('/loja/:idLoja', async (req, res) => {
    try {
        const { idLoja } = req.params;
        
        const notificacoes = await Notificacao.findAll({
            where: { fk_idLoja: idLoja },
            order: [['dataNotificacao', 'DESC']],
            attributes: ['idNotificacao', 'titulo', 'descricao', 'tipo', 'dataNotificacao', 'fk_idLoja']
        });

        res.json(notificacoes);
    } catch (error) {
        console.error('Erro ao buscar notificações da loja:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

module.exports = router; 