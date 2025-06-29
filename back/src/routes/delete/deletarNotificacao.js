const express = require('express');
const router = express.Router();
const Notificacao = require('../../models/notificacao');

// Deletar uma notificação específica
router.delete('/:idNotificacao', async (req, res) => {
    try {
        const { idNotificacao } = req.params;
        
        const notificacao = await Notificacao.findByPk(idNotificacao);
        
        if (!notificacao) {
            return res.status(404).json({ error: 'Notificação não encontrada' });
        }

        await notificacao.destroy();

        res.json({ message: 'Notificação deletada com sucesso' });
    } catch (error) {
        console.error('Erro ao deletar notificação:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

// Deletar todas as notificações de um usuário
router.delete('/todas/:tipo/:id', async (req, res) => {
    try {
        const { tipo, id } = req.params;
        
        let whereClause = {};
        if (tipo === 'cliente') {
            whereClause = { fk_idCliente: id };
        } else if (tipo === 'loja') {
            whereClause = { fk_idLoja: id };
        }

        await Notificacao.destroy({ where: whereClause });

        res.json({ message: 'Todas as notificações foram deletadas' });
    } catch (error) {
        console.error('Erro ao deletar todas as notificações:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

// Deletar apenas notificações lidas
router.delete('/lidas/:tipo/:id', async (req, res) => {
    try {
        const { tipo, id } = req.params;
        
        let whereClause = { lida: true };
        if (tipo === 'cliente') {
            whereClause.fk_idCliente = id;
        } else if (tipo === 'loja') {
            whereClause.fk_idLoja = id;
        }

        await Notificacao.destroy({ where: whereClause });

        res.json({ message: 'Notificações lidas foram deletadas' });
    } catch (error) {
        console.error('Erro ao deletar notificações lidas:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

module.exports = router; 