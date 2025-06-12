const express = require('express');
const Loja = require('../models/loja')
const router = express.Router();

router.post('/loginLoja', async (req, res) => {
    const { email, senha } = req.body;

    try {
        if (!email || !senha) {
            return res.status(400).json({
                success: false,
                message: 'Email e senha são obrigatórios.'
            });
        }

        const loja = await Loja.findOne({
            where: { email: email }
        });

        if (!loja) {
            return res.status(404).json({
                success: false,
                message: 'Loja não encontrada.'
            });
        }

        if (loja.senha !== senha) {
            return res.status(401).json({
                success: false,
                message: 'Senha incorreta.'
            });
        }
        
        return res.status(200).json({
            success: true,
            message: 'Login realizado com sucesso!',
            loja: {
                id: loja.idLoja,
                nomeLoja: loja.nomeLoja,
                nomeVendedor: loja.nomeVendedor,
                email: loja.email,
                horarioAbertura: loja.horarioAbertura,
                horarioFechamento: loja.horarioFechamento,
                telefone: loja.telefone,
                senha: loja.senha
            }
        });

    } catch (error) {
        console.error('Erro no login:', error);
        return res.status(500).json({
            success: false,
            message: 'Erro interno do servidor.'
        });
    }
});

module.exports = router;