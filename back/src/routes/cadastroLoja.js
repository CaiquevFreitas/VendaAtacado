const express = require('express')
const Loja = require('../models/loja')
const { Op } = require('sequelize');
const router = express.Router();

router.post('/cadastroLoja', async (req, res) => {
    const { nomeLoja, nomeVendedor, dataNascimento, cnpj, horarioAbertura, horarioFechamento, telefone, email, senha } = req.body;

    try {
        // Converter os horários para formato HH:mm:ss
        const formatarHorario = (date) => {
            const dataObj = new Date(date);
            return dataObj.toTimeString().split(' ')[0];
        };

        const horarioAberturaFormatado = formatarHorario(horarioAbertura);
        const horarioFechamentoFormatado = formatarHorario(horarioFechamento);

        const lojas = await Loja.findAll({
            where: {
                [Op.or]: [
                    { cnpj: cnpj },
                    { email: email },
                    { telefone: telefone }
                ]
            }
        });

        if (lojas.length > 0) {
            const camposConflitantes = [];

            lojas.forEach(loja => {
                if (loja.cnpj === cnpj && !camposConflitantes.includes('CNPJ')) camposConflitantes.push('CNPJ');
                if (loja.email === email && !camposConflitantes.includes('Email')) camposConflitantes.push('Email');
                if (loja.telefone === telefone && !camposConflitantes.includes('Telefone')) camposConflitantes.push('Telefone');
            });

            return res.status(409).json({
                message: `Já existe uma loja cadastrada com os seguintes campos: ${camposConflitantes.join(', ')}.`
            });
        }

        const novaLoja = await Loja.create({
            nomeLoja,
            nomeVendedor,
            dataNascimento,
            cnpj,
            horarioAbertura: horarioAberturaFormatado,
            horarioFechamento: horarioFechamentoFormatado,
            telefone,
            email,
            senha
        });

        return res.status(201).json({
            message: 'Loja cadastrada com sucesso!',
            loja: novaLoja
        });

    } catch (error) {
        console.error('Erro ao cadastrar loja:', error);
        return res.status(500).json({ message: 'Erro interno do servidor.' });
    }
});

module.exports = router;

