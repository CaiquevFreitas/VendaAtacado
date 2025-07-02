const express = require('express');
const router = express.Router();
const Avaliacao = require('../../models/avaliacao');
const Pedido = require('../../models/pedido');
const Compra = require('../../models/compra');
const ItemPedido = require('../../models/itemPedido');

// POST /avaliacoes
router.post('/avaliacoes', async (req, res) => {
    try {
        const { fk_idCliente, fk_idLoja, fk_idProduto, nota, comentario } = req.body;
        if (!fk_idCliente || !nota || (!fk_idLoja && !fk_idProduto)) {
            return res.status(400).json({ success: false, message: 'Campos obrigatórios não preenchidos.' });
        }

        // Verificar se é avaliação de produto ou loja
        let pedidoEntregue = null;
        if (fk_idProduto) {
            // Buscar pedido entregue que contenha o produto e seja do cliente
            pedidoEntregue = await Pedido.findOne({
                where: { status: 'Entregue', fk_idCliente },
                include: [{
                    model: ItemPedido,
                    as: 'Itens',
                    where: { fk_idProduto }
                }]
            });
        } else if (fk_idLoja) {
            // Buscar pedido entregue da loja e do cliente
            pedidoEntregue = await Pedido.findOne({
                where: { status: 'Entregue', fk_idCliente, fk_idLoja }
            });
        }
        if (!pedidoEntregue) {
            return res.status(403).json({ success: false, message: 'Avaliação não permitida. Pedido não entregue ou não pertence ao cliente.' });
        }

        // Evitar avaliações duplicadas
        const avaliacaoExistente = await Avaliacao.findOne({
            where: {
                fk_idCliente,
                ...(fk_idProduto ? { fk_idProduto } : { fk_idLoja })
            }
        });
        if (avaliacaoExistente) {
            return res.status(409).json({ success: false, message: 'Você já avaliou este item.' });
        }

        // Criar avaliação
        await Avaliacao.create({
            fk_idCliente,
            fk_idLoja: fk_idLoja || null,
            fk_idProduto: fk_idProduto || null,
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

