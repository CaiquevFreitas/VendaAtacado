const express = require('express');
const router = express.Router();
const sequelize = require('../../models/database');
const Produto = require('../../models/produto');
const Pedido = require('../../models/pedido');
const ItemPedido = require('../../models/itemPedido');
const ItemCarrinho = require('../../models/itemCarrinho');
const Carrinho = require('../../models/carrinho');

router.post('/comprar-carrinho', async (req, res) => {
    const transaction = await sequelize.transaction();
    
    try {
        const { idCliente, itensSelecionados } = req.body;
        
        if (!idCliente || !itensSelecionados || itensSelecionados.length === 0) {
            await transaction.rollback();
            return res.status(400).json({ 
                success: false, 
                message: 'Dados inválidos para realizar a compra' 
            });
        }

        // Etapa 1: Validação de Produtos
        const produtosValidados = [];
        const erros = [];

        for (const item of itensSelecionados) {
            const produto = await Produto.findByPk(item.idProduto, { transaction });
            
            if (!produto) {
                erros.push(`Produto com ID ${item.idProduto} não encontrado`);
                continue;
            }

            if (!produto.status) {
                erros.push(`Produto "${produto.nomeProduto}" está inativo`);
                continue;
            }

            if (produto.estoque < item.quantidade) {
                erros.push(`Estoque insuficiente para "${produto.nomeProduto}". Disponível: ${produto.estoque}, Solicitado: ${item.quantidade}`);
                continue;
            }

            produtosValidados.push({
                ...item,
                produto,
                idLoja: produto.fk_idLoja
            });
        }

        if (erros.length > 0) {
            await transaction.rollback();
            return res.status(400).json({
                success: false,
                message: 'Erros de validação encontrados',
                errors: erros
            });
        }

        // Etapa 2: Agrupamento por Loja
        const produtosPorLoja = {};
        produtosValidados.forEach(item => {
            const idLoja = item.idLoja;
            if (!produtosPorLoja[idLoja]) {
                produtosPorLoja[idLoja] = [];
            }
            produtosPorLoja[idLoja].push(item);
        });

        // Etapa 3: Criação de Pedidos e Itens
        const pedidosCriados = [];

        for (const [idLoja, produtos] of Object.entries(produtosPorLoja)) {
            // Criar pedido para esta loja
            const pedido = await Pedido.create({
                fk_idCliente: idCliente,
                fk_idLoja: parseInt(idLoja),
                total: 0,
                status: 'Em Processamento'
            }, { transaction });

            let totalPedido = 0;

            // Criar itens do pedido
            for (const item of produtos) {
                const itemPedido = await ItemPedido.create({
                    quantidade: item.quantidade,
                    precoUnitario: item.precoUnitario,
                    fk_idProduto: item.idProduto,
                    fk_idPedido: pedido.idPedido
                }, { transaction });

                // Atualizar estoque do produto
                await Produto.update({
                    estoque: item.produto.estoque - item.quantidade
                }, {
                    where: { idProduto: item.idProduto },
                    transaction
                });

                totalPedido += item.precoUnitario * item.quantidade;
            }

            // Atualizar total do pedido
            await Pedido.update({
                total: totalPedido
            }, {
                where: { idPedido: pedido.idPedido },
                transaction
            });

            pedidosCriados.push({
                idPedido: pedido.idPedido,
                idLoja: parseInt(idLoja),
                total: totalPedido,
                status: 'Em Processamento',
                produtos: produtos.map(p => ({
                    idProduto: p.idProduto,
                    nome: p.produto.nomeProduto,
                    quantidade: p.quantidade,
                    precoUnitario: p.precoUnitario
                }))
            });
        }

        // Etapa 4: Remover itens do carrinho
        const idsItensCarrinho = itensSelecionados.map(item => item.idItemCarrinho);
        await ItemCarrinho.destroy({
            where: { idItemCarrinho: idsItensCarrinho },
            transaction
        });

        await transaction.commit();

        res.json({
            success: true,
            message: 'Pedidos criados com sucesso! Aguardando confirmação das lojas.',
            pedidos: pedidosCriados,
            totalPedidos: pedidosCriados.length
        });

    } catch (error) {
        await transaction.rollback();
        console.error('Erro ao criar pedidos:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor ao processar os pedidos'
        });
    }
});

module.exports = router;
