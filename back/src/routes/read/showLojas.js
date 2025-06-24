const express = require('express');
const Loja = require('../../models/loja');
const Avaliacao = require('../../models/avaliacao');
const { Op, fn, col, literal, QueryTypes } = require('sequelize');
const sequelize = require('../../models/database');
const router = express.Router();

router.get('/showLojas', async (req, res) => {
    try {
        // Usar query raw para calcular a nota média
        const lojas = await sequelize.query(`
            SELECT 
                l.idLoja,
                l.nomeLoja,
                l.logo,
                COALESCE(AVG(a.nota), 0) as notaMedia,
                COUNT(a.idAvaliacao) as totalAvaliacoes
            FROM loja l
            LEFT JOIN avaliacao a ON l.idLoja = a.fk_idLoja
            GROUP BY l.idLoja, l.nomeLoja, l.logo
            ORDER BY notaMedia DESC, l.nomeLoja ASC
            LIMIT 10
        `, {
            type: QueryTypes.SELECT
        });

        // Formata os dados das lojas
        const lojasFormatadas = lojas.map(loja => ({
            id: loja.idLoja,
            nomeLoja: loja.nomeLoja,
            logo: loja.logo ? `${loja.logo}` : null,
            nota: parseFloat(loja.notaMedia) || 0,
            totalAvaliacoes: parseInt(loja.totalAvaliacoes) || 0
        }));

        return res.status(200).json({
            success: true,
            message: 'Lojas encontradas com sucesso!',
            lojas: lojasFormatadas
        });

    } catch (error) {
        console.error('Erro ao buscar lojas:', error);
        return res.status(500).json({
            success: false,
            message: 'Erro interno do servidor.'
        });
    }
});

module.exports = router;
