const express = require('express');
const router = express.Router();
const sequelize = require('../../models/database');
const Produto = require('../../models/produto');
const Avaliacao = require('../../models/avaliacao');

// Buscar os 4 produtos com melhores notas
router.get('/produtos-destaque', async (req, res) => {
    try {
        // Buscar produtos que têm avaliações usando uma consulta mais simples
        const [produtosComAvaliacoes] = await sequelize.query(`
            SELECT 
                p.idProduto,
                p.nomeProduto,
                p.preco,
                p.imagem,
                p.estoque,
                AVG(a.nota) as notaMedia,
                COUNT(a.idAvaliacao) as totalAvaliacoes
            FROM produto p
            INNER JOIN avaliacao a ON p.idProduto = a.fk_idProduto
            WHERE p.status = true
            GROUP BY p.idProduto
            ORDER BY notaMedia DESC
            LIMIT 4
        `);

        // Se não houver produtos com avaliações, buscar produtos aleatórios
        if (produtosComAvaliacoes.length === 0) {
            const produtosAleatorios = await Produto.findAll({
                where: {
                    status: true
                },
                attributes: [
                    'idProduto',
                    'nomeProduto',
                    'preco',
                    'imagem',
                    'estoque'
                ],
                order: sequelize.literal('RAND()'),
                limit: 4
            });

            const produtosFormatados = produtosAleatorios.map(produto => ({
                id: produto.idProduto,
                nome: produto.nomeProduto,
                preco: produto.preco,
                imagem: produto.imagem,
                estoque: produto.estoque,
                notaMedia: '0.0',
                totalAvaliacoes: 0
            }));

            return res.json(produtosFormatados);
        }

        // Formatar os dados dos produtos com avaliações
        const produtosFormatados = produtosComAvaliacoes.map(produto => ({
            id: produto.idProduto,
            nome: produto.nomeProduto,
            preco: produto.preco,
            imagem: produto.imagem,
            estoque: produto.estoque,
            notaMedia: parseFloat(produto.notaMedia || 0).toFixed(1),
            totalAvaliacoes: parseInt(produto.totalAvaliacoes || 0)
        }));

        res.json(produtosFormatados);
    } catch (error) {
        console.error('Erro ao buscar produtos em destaque:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

module.exports = router;
