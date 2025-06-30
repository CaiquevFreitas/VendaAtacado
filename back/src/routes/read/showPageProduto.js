const express = require('express');
const router = express.Router();
const Produto = require('../../models/produto');
const Avaliacao = require('../../models/avaliacao');
const Cliente = require('../../models/cliente');

router.get('/showPageProduto/:idProduto', async (req, res) => {
    try {
        const { idProduto } = req.params;

        // Buscar dados do produto
        const produto = await Produto.findOne({
            where: { idProduto },
            attributes: ['idProduto', 'nomeProduto', 'imagem', 'descricao', 'preco', 'estoque']
        });

        if (!produto) {
            return res.status(404).json({ error: 'Produto não encontrado' });
        }

        // Buscar avaliações do produto (com nome do cliente)
        const avaliacoes = await Avaliacao.findAll({
            where: { fk_idProduto: idProduto },
            include: [{
                model: Cliente,
                as: 'Cliente',
                attributes: ['nomeCliente']
            }],
            attributes: ['idAvaliacao', 'nota', 'comentario']
        });

        // Formatar avaliações para incluir nome do cliente
        const avaliacoesFormatadas = avaliacoes.map(av => ({
            id: av.idAvaliacao,
            nomeCliente: av.Cliente ? av.Cliente.nomeCliente : 'Cliente',
            nota: av.nota,
            comentario: av.comentario
        }));

        res.json({
            produto,
            avaliacoes: avaliacoesFormatadas
        });
    } catch (error) {
        console.error('Erro ao buscar página do produto:', error);
        res.status(500).json({ error: 'Erro ao buscar página do produto' });
    }
});

module.exports = router;