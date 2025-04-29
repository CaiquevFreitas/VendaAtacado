const express = require('express');
const Cliente = require('../models/cliente');
const { Op } = require('sequelize');
const router = express.Router();

router.post('/cadastroCliente', async (req, res) => {
    const { nome, dataFormatada, cpf, email, telefone, senha } = req.body;

    try {
        const usuarios = await Cliente.findAll({
            where: {
                [Op.or]: [
                    { cpf: cpf },
                    { email: email },
                    { telefone: telefone }
                ]
            }
        });

        if (usuarios.length > 0) {
            const camposConflitantes = [];

            usuarios.forEach(usuario => {
                if (usuario.cpf === cpf && !camposConflitantes.includes('CPF')) camposConflitantes.push('CPF');
                if (usuario.email === email && !camposConflitantes.includes('Email')) camposConflitantes.push('Email');
                if (usuario.telefone === telefone && !camposConflitantes.includes('Telefone')) camposConflitantes.push('Telefone');
            });

            return res.status(409).json({
                message: `Já existe um usuário cadastrado com os seguintes campos: ${camposConflitantes.join(', ')}.`
            });
        }

        
        const novoCliente = await Cliente.create({
            nomeCliente: nome,
            dataNascimento: dataFormatada,
            cpf,
            email,
            telefone,
            senha
        });

        return res.status(201).json({
            message: 'Cliente cadastrado com sucesso!',
            cliente: novoCliente
        });

    } catch (error) {
        console.error('Erro ao cadastrar cliente:', error);
        return res.status(500).json({ message: 'Erro interno do servidor.' });
    }
});

module.exports = router;
