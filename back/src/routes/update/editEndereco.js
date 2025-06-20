const express = require('express');
const Endereco = require('../../models/endereco');
const router = express.Router();

router.put('/editEndereco/:idEndereco', async (req, res) => {
    try {
        const { idEndereco } = req.params;
        const { estado, cidade, bairro, logradouro, numero, cep } = req.body;

        const endereco = await Endereco.findByPk(idEndereco);
        if (!endereco) {
            return res.status(404).json({ message: 'Endereço não encontrado.' });
        }

        await endereco.update({
            estado: estado ?? endereco.estado,
            cidade: cidade ?? endereco.cidade,
            bairro: bairro ?? endereco.bairro,
            logradouro: logradouro ?? endereco.logradouro,
            numero: numero ?? endereco.numero,
            cep: cep ?? endereco.cep
        });

        res.json({ message: 'Endereço atualizado com sucesso!', endereco });
    } catch (error) {
        console.error('Erro ao editar endereço:', error);
        res.status(500).json({ message: 'Erro ao editar endereço', error: error.message });
    }
});

module.exports = router;
