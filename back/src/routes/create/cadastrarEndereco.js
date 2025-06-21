const express = require('express');
const Endereco = require('../../models/endereco');
const router = express.Router();

router.post('/cadastrarEndereco', async (req, res) => {
    try {
        const { estado, cidade, bairro, logradouro, numero, cep, fk_idLoja } = req.body;
        if (!estado || !cidade || !bairro || !logradouro || !numero || !cep || !fk_idLoja) {
            return res.status(400).json({ message: 'Preencha todos os campos obrigatórios.' });
        }
        const novoEndereco = await Endereco.create({
            estado,
            cidade,
            bairro,
            logradouro,
            numero,
            cep,
            fk_idLoja
        });
        
        res.status(201).json({ message: 'Endereço cadastrado com sucesso!', endereco: novoEndereco });
    } catch (error) {
        console.error('Erro ao cadastrar endereço:', error);
        res.status(500).json({ message: 'Erro ao cadastrar endereço', error: error.message });
    }
});

module.exports = router;
