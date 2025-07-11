const express = require('express');
const router = express.Router();
const Pedido = require('../../models/pedido');
const ItemPedido = require('../../models/itemPedido');
const Avaliacao = require('../../models/avaliacao');
const Loja = require('../../models/loja');
const Produto = require('../../models/produto');

// GET /avaliacoes/pendentes/:idCliente
router.get('/avaliacoes/pendentes/:idCliente', async (req, res) => {
    try {
        const { idCliente } = req.params;
        // Buscar pedidos entregues do cliente
        const pedidos = await Pedido.findAll({
            where: { fk_idCliente: idCliente, status: 'Entregue' },
            include: [
                { model: ItemPedido, as: 'Itens', include: [{ model: Produto, as: 'Produto' }] },
                { model: Loja, as: 'Loja' }
            ]
        });
        // Buscar avaliações já feitas
        const avaliacoes = await Avaliacao.findAll({ where: { fk_idCliente: idCliente } });
        // Montar listas pendentes
        const pendentes = [];
        pedidos.forEach(pedido => {
            // Loja: só pendente se não existe avaliação para esse pedido
            const lojaAvaliada = avaliacoes.some(a => a.fk_idLoja === pedido.fk_idLoja && a.fk_idPedido === pedido.idPedido);
            if (!lojaAvaliada) {
                pendentes.push({ tipo: 'loja', idLoja: pedido.fk_idLoja, nomeLoja: pedido.Loja?.nomeLoja, idPedido: pedido.idPedido });
            }
            // Produtos: só pendente se não existe avaliação para esse pedido
            pedido.Itens.forEach(item => {
                const produtoAvaliado = avaliacoes.some(a => a.fk_idProduto === item.fk_idProduto && a.fk_idPedido === pedido.idPedido);
                if (!produtoAvaliado) {
                    pendentes.push({ tipo: 'produto', idProduto: item.fk_idProduto, nomeProduto: item.Produto?.nomeProduto, idPedido: pedido.idPedido });
                }
            });
        });
        res.json({ success: true, pendentes });
    } catch (error) {
        console.error('Erro ao buscar avaliações pendentes:', error);
        res.status(500).json({ success: false, message: 'Erro ao buscar avaliações pendentes.' });
    }
});

module.exports = router;
