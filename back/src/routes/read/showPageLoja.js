const express = require('express');
const router = express.Router();
const Loja = require('../../models/loja');
const Produto = require('../../models/produto');
const Avaliacao = require('../../models/avaliacao');
const Cliente = require('../../models/cliente');
const Endereco = require('../../models/endereco');

router.get('/showPageLoja/:idLoja', async (req, res) => {
    try {
        const { idLoja } = req.params;

        // Buscar dados da loja
        const loja = await Loja.findOne({
            where: { idLoja },
            attributes: ['idLoja', 'nomeLoja', 'logo', 'nota']
        });

        if (!loja) {
            return res.status(404).json({ error: 'Loja não encontrada' });
        }

        // Buscar endereço da loja
        const endereco = await Endereco.findOne({
            where: { fk_idLoja: idLoja }
        });

        // Buscar produtos da loja
        const produtos = await Produto.findAll({
            where: { fk_idLoja: idLoja },
            attributes: ['idProduto', 'nomeProduto', 'imagem', 'preco', 'estoque']
        });

        // Buscar avaliações da loja (com nome do cliente)
        const avaliacoes = await Avaliacao.findAll({
            where: { fk_idLoja: idLoja },
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
            loja,
            endereco,
            produtos,
            avaliacoes: avaliacoesFormatadas
        });
    } catch (error) {
        console.error('Erro ao buscar página da loja:', error);
        res.status(500).json({ error: 'Erro ao buscar página da loja' });
    }
});

module.exports = router;