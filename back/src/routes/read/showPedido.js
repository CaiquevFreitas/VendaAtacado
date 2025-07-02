const express = require('express');
const router = express.Router();
const Pedido = require('../../models/pedido');
const ItemPedido = require('../../models/itemPedido');
const Cliente = require('../../models/cliente');
const Produto = require('../../models/produto');

router.get('/pedidos-loja/:idLoja', async (req, res) => {
    try {
        const { idLoja } = req.params;
        const { status } = req.query; // Para filtro por status

        if (!idLoja) {
            return res.status(400).json({ message: 'ID da loja é obrigatório' });
        }

        // Construir condições de busca
        const whereCondition = { fk_idLoja: idLoja };
        if (status && status !== 'todos') {
            whereCondition.status = status;
        }

        const pedidos = await Pedido.findAll({
            where: whereCondition,
            include: [
                {
                    model: Cliente,
                    as: 'Cliente',
                    attributes: ['idCliente', 'nomeCliente', 'telefone']
                },
                {
                    model: ItemPedido,
                    as: 'Itens',
                    include: [
                        {
                            model: Produto,
                            as: 'Produto',
                            attributes: ['idProduto', 'nomeProduto', 'imagem']
                        }
                    ]
                }
            ],
            order: [['idPedido', 'DESC']] // Pedidos mais recentes primeiro
        });

        const pedidosFormatados = pedidos.map((pedido, index) => ({
            idPedido: pedido.idPedido,
            numeroPedido: pedidos.length - index, // Número sequencial (mais antigo = 1)
            total: pedido.total,
            status: pedido.status,
            dataPedido: pedido.createdAt || new Date(),
            cliente: {
                idCliente: pedido.Cliente.idCliente,
                nome: pedido.Cliente.nomeCliente,
                telefone: pedido.Cliente.telefone
            },
            produtos: pedido.Itens.map(item => ({
                idProduto: item.Produto.idProduto,
                nome: item.Produto.nomeProduto,
                imagem: item.Produto.imagem,
                quantidade: item.quantidade,
                precoUnitario: item.precoUnitario,
                subtotal: item.quantidade * item.precoUnitario
            }))
        }));

        return res.status(200).json({
            message: 'Pedidos recuperados com sucesso',
            pedidos: pedidosFormatados
        });

    } catch (error) {
        console.error('Erro ao buscar pedidos da loja:', error);
        return res.status(500).json({ message: 'Erro interno do servidor' });
    }
});

module.exports = router;
