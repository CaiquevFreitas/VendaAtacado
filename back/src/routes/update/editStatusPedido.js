const express = require('express');
const router = express.Router();
const sequelize = require('../../models/database');
const Pedido = require('../../models/pedido');
const Compra = require('../../models/compra');

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

        // Se o status foi alterado para 'Em preparo', criar o registro de compra
        if (novoStatus === 'Em preparo') {
            const compraExistente = await Compra.findOne({
                where: { fk_idPedido: idPedido },
                transaction
            });

            if (!compraExistente) {
                await Compra.create({
                    dataCompra: new Date(),
                    fk_idCliente: pedido.fk_idCliente,
                    fk_idPedido: idPedido
                }, { transaction });
            }
        }

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
