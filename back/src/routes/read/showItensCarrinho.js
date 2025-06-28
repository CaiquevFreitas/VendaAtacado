const express = require('express');
const router = express.Router();
const ItemCarrinho = require('../../models/itemCarrinho');
const Carrinho = require('../../models/carrinho');
const Produto = require('../../models/produto');

router.get('/itensCarrinho/:idCliente', async (req, res) => {
    try {
        const { idCliente } = req.params;

        if (!idCliente) {
            return res.status(400).json({ message: 'ID do cliente é obrigatório' });
        }

        const carrinho = await Carrinho.findOne({
            where: { fk_idCliente: idCliente }
        });

        if (!carrinho) {
            return res.status(404).json({ message: 'Carrinho não encontrado para este cliente' });
        }

        const itensCarrinho = await ItemCarrinho.findAll({
            where: { fk_idCarrinho: carrinho.idCarrinho },
            include: [{
                model: Produto,
                as: 'Produto',
                attributes: ['idProduto', 'nomeProduto', 'imagem', 'preco']
            }],
            attributes: ['idItemCarrinho', 'quantidade', 'precoUnitario']
        });

        const itensFormatados = itensCarrinho.map(item => ({
            id: item.idItemCarrinho,
            idProduto: item.Produto.idProduto,
            nome: item.Produto.nome,
            imagem: item.Produto.imagem,
            precoUnitario: item.precoUnitario,
            quantidade: item.quantidade,
            selecionado: false 
        }));

        return res.status(200).json({
            message: 'Itens do carrinho recuperados com sucesso',
            itens: itensFormatados
        });

    } catch (error) {
        console.error('Erro ao buscar itens do carrinho:', error);
        return res.status(500).json({ message: 'Erro interno do servidor' });
    }
});

module.exports = router;
