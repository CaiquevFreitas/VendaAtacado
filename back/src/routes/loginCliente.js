const express = require('express');
const Cliente = require('../models/cliente');
const router = express.Router();

router.post('/loginCliente', async (req, res) => {
    const { email, senha } = req.body;

    try {
        if (!email || !senha) {
            return res.status(400).json({
                success: false,
                message: 'Email e senha são obrigatórios.'
            });
        }

        const user = await Cliente.findOne({
            where: { email: email }
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'Usuário não encontrado.'
            });
        }

        if (user.senha !== senha) {
            return res.status(401).json({
                success: false,
                message: 'Senha incorreta.'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Login realizado com sucesso!',
            user: {
                id: user.id,
                nome: user.nomeCliente,
                email: user.email,
                telefone: user.telefone,
                dataNascimento: user.dataNascimento,
                senha: user.senha
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