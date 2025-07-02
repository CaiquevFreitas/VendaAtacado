const express = require('express');
const router = express.Router();
const Avaliacao = require('../../models/avaliacao');
const Pedido = require('../../models/pedido');
const Compra = require('../../models/compra');
const ItemPedido = require('../../models/itemPedido');

// POST /avaliacoes
router.post('/avaliacoes', async (req, res) => {
    try {
        const { fk_idCliente, fk_idLoja, fk_idProduto, nota, comentario, fk_idPedido } = req.body;
        if (!fk_idCliente || !nota || (!fk_idLoja && !fk_idProduto) || !fk_idPedido) {
            return res.status(400).json({ success: false, message: 'Campos obrigatórios não preenchidos.' });
        }

        // Verificar se o pedido é realmente do cliente e está entregue
        let pedidoEntregue = null;
        if (fk_idProduto) {
            pedidoEntregue = await Pedido.findOne({
                where: { status: 'Entregue', fk_idCliente, idPedido: fk_idPedido },
                include: [{
                    model: ItemPedido,
                    as: 'Itens',
                    where: { fk_idProduto }
                }]
            });
        } else if (fk_idLoja) {
            pedidoEntregue = await Pedido.findOne({
                where: { status: 'Entregue', fk_idCliente, fk_idLoja, idPedido: fk_idPedido }
            });
        }
        if (!pedidoEntregue) {
            return res.status(403).json({ success: false, message: 'Avaliação não permitida. Pedido não entregue ou não pertence ao cliente.' });
        }

        // Verificar se já existe avaliação para esse pedido
        let avaliacaoExistente = await Avaliacao.findOne({
            where: {
                fk_idCliente,
                fk_idPedido,
                ...(fk_idProduto ? { fk_idProduto } : { fk_idLoja })
            }
        });
        if (avaliacaoExistente) {
            // Atualizar avaliação existente
            avaliacaoExistente.nota = nota;
            avaliacaoExistente.comentario = comentario;
            await avaliacaoExistente.save();
            return res.json({ success: true, message: 'Avaliação atualizada com sucesso!' });
        }

        // Criar avaliação nova
        await Avaliacao.create({
            fk_idCliente,
            fk_idLoja: fk_idLoja || null,
            fk_idProduto: fk_idProduto || null,
            fk_idPedido,
            nota,
            comentario
        });
        return res.json({ success: true, message: 'Avaliação registrada com sucesso!' });
    } catch (error) {
        console.error('Erro ao registrar avaliação:', error);
        return res.status(500).json({ success: false, message: 'Erro interno ao registrar avaliação.' });
    }
});

module.exports = router;

