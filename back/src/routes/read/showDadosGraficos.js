const express = require('express');
const router = express.Router();
const sequelize = require('../../models/database');
const Pedido = require('../../models/pedido');
const Compra = require('../../models/compra');
const ItemPedido = require('../../models/itemPedido');
const Produto = require('../../models/produto');

// Buscar dados para relatórios da loja
router.get('/relatorios/:idLoja', async (req, res) => {
    try {
        const { idLoja } = req.params;
        const { periodo = 'mes' } = req.query; // dia, semana, mes

        // 1. Vendas por período
        let vendasPorPeriodo;
        if (periodo === 'dia') {
            vendasPorPeriodo = await sequelize.query(`
                SELECT 
                    DATE(c.dataCompra) as data,
                    SUM(p.total) as totalVendas,
                    COUNT(p.idPedido) as totalPedidos
                FROM compra c
                JOIN pedido p ON c.fk_idPedido = p.idPedido
                WHERE p.fk_idLoja = ? AND c.dataCompra >= DATE_SUB(NOW(), INTERVAL 30 DAY)
                GROUP BY DATE(c.dataCompra)
                ORDER BY data DESC
                LIMIT 30
            `, {
                replacements: [idLoja],
                type: sequelize.QueryTypes.SELECT
            });
        } else if (periodo === 'semana') {
            vendasPorPeriodo = await sequelize.query(`
                SELECT 
                    YEARWEEK(c.dataCompra) as semana,
                    SUM(p.total) as totalVendas,
                    COUNT(p.idPedido) as totalPedidos
                FROM compra c
                JOIN pedido p ON c.fk_idPedido = p.idPedido
                WHERE p.fk_idLoja = ? AND c.dataCompra >= DATE_SUB(NOW(), INTERVAL 12 WEEK)
                GROUP BY YEARWEEK(c.dataCompra)
                ORDER BY semana DESC
                LIMIT 12
            `, {
                replacements: [idLoja],
                type: sequelize.QueryTypes.SELECT
            });
        } else {
            vendasPorPeriodo = await sequelize.query(`
                SELECT 
                    DATE_FORMAT(c.dataCompra, '%Y-%m') as mes,
                    SUM(p.total) as totalVendas,
                    COUNT(p.idPedido) as totalPedidos
                FROM compra c
                JOIN pedido p ON c.fk_idPedido = p.idPedido
                WHERE p.fk_idLoja = ? AND c.dataCompra >= DATE_SUB(NOW(), INTERVAL 12 MONTH)
                GROUP BY DATE_FORMAT(c.dataCompra, '%Y-%m')
                ORDER BY mes DESC
                LIMIT 12
            `, {
                replacements: [idLoja],
                type: sequelize.QueryTypes.SELECT
            });
        }

        // 2. Produtos mais vendidos
        const produtosMaisVendidos = await sequelize.query(`
            SELECT 
                p.nomeProduto,
                SUM(ip.quantidade) as totalVendido,
                SUM(ip.quantidade * ip.precoUnitario) as totalReceita
            FROM itemPedido ip
            JOIN pedido ped ON ip.fk_idPedido = ped.idPedido
            JOIN produto p ON ip.fk_idProduto = p.idProduto
            WHERE ped.fk_idLoja = ? AND ped.status = 'Entregue'
            GROUP BY p.idProduto, p.nomeProduto
            ORDER BY totalVendido DESC
            LIMIT 10
        `, {
            replacements: [idLoja],
            type: sequelize.QueryTypes.SELECT
        });

        // 3. Status dos pedidos
        const statusPedidos = await sequelize.query(`
            SELECT 
                status,
                COUNT(*) as quantidade
            FROM pedido
            WHERE fk_idLoja = ?
            GROUP BY status
        `, {
            replacements: [idLoja],
            type: sequelize.QueryTypes.SELECT
        });

        // 4. Horários com mais vendas
        const horariosVendas = await sequelize.query(`
            SELECT 
                HOUR(c.dataCompra) as hora,
                COUNT(p.idPedido) as totalPedidos,
                SUM(p.total) as totalVendas
            FROM compra c
            JOIN pedido p ON c.fk_idPedido = p.idPedido
            WHERE p.fk_idLoja = ? AND c.dataCompra >= DATE_SUB(NOW(), INTERVAL 30 DAY)
            GROUP BY HOUR(c.dataCompra)
            ORDER BY hora
        `, {
            replacements: [idLoja],
            type: sequelize.QueryTypes.SELECT
        });

        // 5. Resumo geral
        const resumoGeral = await sequelize.query(`
            SELECT 
                COUNT(p.idPedido) as totalPedidos,
                SUM(p.total) as totalVendas,
                AVG(p.total) as ticketMedio,
                COUNT(DISTINCT p.fk_idCliente) as clientesUnicos
            FROM pedido p
            WHERE p.fk_idLoja = ? AND p.status = 'Entregue'
        `, {
            replacements: [idLoja],
            type: sequelize.QueryTypes.SELECT
        });

        res.json({
            vendasPorPeriodo: vendasPorPeriodo || [],
            produtosMaisVendidos: produtosMaisVendidos || [],
            statusPedidos: statusPedidos || [],
            horariosVendas: horariosVendas || [],
            resumoGeral: resumoGeral[0] || {
                totalPedidos: 0,
                totalVendas: 0,
                ticketMedio: 0,
                clientesUnicos: 0
            }
        });
    } catch (error) {
        console.error('Erro ao buscar dados dos relatórios:', error);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
});

module.exports = router;

