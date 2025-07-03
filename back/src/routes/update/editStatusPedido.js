const express = require('express');
const router = express.Router();
const sequelize = require('../../models/database');
const Pedido = require('../../models/pedido');
const Compra = require('../../models/compra');
const Notificacao = require('../../models/notificacao');
const ItemPedido = require('../../models/itemPedido');
const Produto = require('../../models/produto');

router.put('/editar-status-pedido', async (req, res) => {
    const transaction = await sequelize.transaction();
    
    try {
        const { idPedido, novoStatus } = req.body;
        
        if (!idPedido || !novoStatus) {
            await transaction.rollback();
            return res.status(400).json({ 
                success: false, 
                message: 'ID do pedido e novo status são obrigatórios' 
            });
        }

        // Buscar o pedido atual
        const pedido = await Pedido.findByPk(idPedido, { transaction });
        
        if (!pedido) {
            await transaction.rollback();
            return res.status(404).json({
                success: false,
                message: 'Pedido não encontrado'
            });
        }

        // Verificar se o pedido pode ser alterado
        if (pedido.status === 'Entregue' || pedido.status === 'Cancelado') {
            await transaction.rollback();
            return res.status(400).json({
                success: false,
                message: `Pedidos com status "${pedido.status}" não podem ser alterados`
            });
        }

        // Validar se o novo status é válido
        const statusValidos = ['Em Processamento', 'Em preparo', 'Pronto', 'Entregue', 'Cancelado'];
        if (!statusValidos.includes(novoStatus)) {
            await transaction.rollback();
            return res.status(400).json({
                success: false,
                message: 'Status inválido'
            });
        }

        // Atualizar o status do pedido
        await Pedido.update({
            status: novoStatus
        }, {
            where: { idPedido: idPedido },
            transaction
        });

        // Se o status foi alterado para 'Entregue', criar o registro de compra
        if (novoStatus === 'Entregue') {
            const compraExistente = await Compra.findOne({
                where: { fk_idPedido: idPedido },
                transaction
            });

            if (!compraExistente) {
                // Ajuste para horário de Brasília (UTC-3)
                const dataAgora = new Date();
                dataAgora.setHours(dataAgora.getHours() - 3);
                await Compra.create({
                    dataCompra: dataAgora,
                    fk_idCliente: pedido.fk_idCliente,
                    fk_idPedido: idPedido
                }, { transaction });
            }
        }

        // Se o status foi alterado para 'Cancelado', devolver estoque dos produtos
        if (novoStatus === 'Cancelado') {
            // Buscar todos os itens do pedido
            const itensPedido = await ItemPedido.findAll({
                where: { fk_idPedido: idPedido },
                transaction
            });
            // Para cada item, devolver a quantidade ao estoque do produto
            for (const item of itensPedido) {
                await Produto.increment(
                    { estoque: item.quantidade },
                    { where: { idProduto: item.fk_idProduto }, transaction }
                );
            }
        }

        // Criar notificação para o cliente sobre a mudança de status
        let tituloNotificacao = '';
        let descricaoNotificacao = '';

        switch (novoStatus) {
            case 'Em preparo':
                tituloNotificacao = 'Pedido em Preparo';
                descricaoNotificacao = `Seu pedido #${idPedido} está sendo preparado pela loja.`;
                break;
            case 'Pronto':
                tituloNotificacao = 'Pedido Pronto';
                descricaoNotificacao = `Seu pedido #${idPedido} está pronto para entrega!`;
                break;
            case 'Entregue':
                tituloNotificacao = 'Pedido Entregue';
                descricaoNotificacao = `Seu pedido #${idPedido} foi entregue com sucesso. Obrigado pela compra!`;
                break;
            case 'Cancelado':
                tituloNotificacao = 'Pedido Cancelado';
                descricaoNotificacao = `Seu pedido #${idPedido} foi cancelado. Entre em contato com a loja para mais informações.`;
                break;
            default:
                tituloNotificacao = 'Status do Pedido Atualizado';
                descricaoNotificacao = `O status do seu pedido #${idPedido} foi alterado para "${novoStatus}".`;
        }

        await Notificacao.create({
            titulo: tituloNotificacao,
            descricao: descricaoNotificacao,
            tipo: 'Pedido',
            dataNotificacao: new Date(),
            fk_idCliente: pedido.fk_idCliente
        }, { transaction });

        await transaction.commit();

        res.json({
            success: true,
            message: `Status do pedido alterado para "${novoStatus}" com sucesso!`,
            pedido: {
                idPedido: pedido.idPedido,
                statusAnterior: pedido.status,
                novoStatus: novoStatus
            }
        });

    } catch (error) {
        await transaction.rollback();
        console.error('Erro ao editar status do pedido:', error);
        res.status(500).json({
            success: false,
            message: 'Erro interno do servidor ao alterar status do pedido'
        });
    }
});

module.exports = router;
