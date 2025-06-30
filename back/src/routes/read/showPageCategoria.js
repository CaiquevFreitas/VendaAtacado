const express = require('express');
const router = express.Router();
const sequelize = require('../../models/database');
const Produto = require('../../models/produto');
const Avaliacao = require('../../models/avaliacao');

// Buscar produtos por categoria
router.get('/categoria/:categoria', async (req, res) => {
    try {
        const { categoria } = req.params;
        
        // Validar se a categoria é válida
        const categoriasValidas = ['Frutas', 'Vegetais', 'Doces', 'Almoço', 'Bebidas', 'Verduras', 'Carnes', 'Limpeza', 'Bolos', 'Salgados'];
        
        if (!categoriasValidas.includes(categoria)) {
            return res.status(400).json({ error: 'Categoria inválida' });
        }

        // Buscar produtos da categoria com avaliações
        const produtosComAvaliacoes = await sequelize.query(`
            SELECT 
                p.idProduto,
                p.nomeProduto,
                p.preco,
                p.imagem,
                p.estoque,
                p.descricao,
                p.categoria,
                l.nomeLoja,
                l.logo as logoLoja,
                AVG(a.nota) as notaMedia,
                COUNT(a.idAvaliacao) as totalAvaliacoes
            FROM produto p
            LEFT JOIN avaliacao a ON p.idProduto = a.fk_idProduto
            LEFT JOIN loja l ON p.fk_idLoja = l.idLoja
            WHERE p.status = true AND p.categoria = ?
            GROUP BY p.idProduto
            ORDER BY notaMedia DESC, p.nomeProduto ASC
            LIMIT 20
        `, {
            replacements: [categoria],
            type: sequelize.QueryTypes.SELECT
        });

        // Formatar os dados dos produtos
        const produtosFormatados = produtosComAvaliacoes.map(produto => ({
            id: produto.idProduto,
            nome: produto.nomeProduto,
            preco: produto.preco,
            imagem: produto.imagem,
            estoque: produto.estoque,
            descricao: produto.descricao,
            categoria: produto.categoria,
            nomeLoja: produto.nomeLoja,
            logoLoja: produto.logoLoja,
            notaMedia: parseFloat(produto.notaMedia || 0).toFixed(1),
            totalAvaliacoes: parseInt(produto.totalAvaliacoes || 0)
        }));

        res.json({
            categoria: categoria,
            produtos: produtosFormatados,
            total: produtosFormatados.length
        });
    } catch (error) {
        console.error('Erro ao buscar produtos por categoria:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

module.exports = router;
