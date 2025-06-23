const express = require('express');
const Cliente = require('../../models/cliente');
const router = express.Router();

router.put('/editCliente/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const {
            email,
            telefone,
            senha
        } = req.body;

        const camposParaAtualizar = {};

        if (email !== undefined && email !== null && email.trim() !== '') {
            camposParaAtualizar.email = email;
        }
        if (telefone !== undefined && telefone !== null && telefone.trim() !== '') {
            camposParaAtualizar.telefone = telefone;
        }
        if (senha !== undefined && senha !== null && senha.trim() !== '') {
            camposParaAtualizar.senha = senha;
        }

        const numRowsUpdated = await Cliente.update(camposParaAtualizar, {
            where: { idCliente: id }
        });

        const clienteExiste = await Cliente.findOne({
            where: { idCliente: id }
        });

        if (!clienteExiste) {
            return res.status(404).json({ error: 'Cliente não encontrado' });
        }

        const clienteAtualizado = await Cliente.findOne({
            where: { idCliente: id }
        });

        res.json({ message: 'Cliente atualizado com sucesso', cliente: clienteAtualizado });
    } catch (error) {
        console.error('Erro ao atualizar cliente:', error);
        res.status(500).json({ error: 'Erro ao atualizar o cliente' });
    }
});

module.exports = router;
