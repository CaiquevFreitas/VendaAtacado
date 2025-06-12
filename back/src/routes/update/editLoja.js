const express = require('express');
const Loja = require('../../models/loja');  
const router = express.Router();

router.put('/editLoja/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { 
            nome, 
            horarioAbertura, 
            horarioFechamento, 
            telefone, 
            senha 
        } = req.body;
        
        // Cria um objeto com apenas os campos que devem ser atualizados
        const camposParaAtualizar = {};
        
        if (nome) {
            camposParaAtualizar.nomeLoja = nome;
        }
        
        if (horarioAbertura) {
            camposParaAtualizar.horarioAbertura = horarioAbertura;
        }
        
        if (horarioFechamento) {
            camposParaAtualizar.horarioFechamento = horarioFechamento;
        }
        
        if (telefone) {
            camposParaAtualizar.telefone = telefone;
        }
        
        if (senha) {
            camposParaAtualizar.senha = senha;
        }
        
        // Atualiza os campos
        const numRowsUpdated = await Loja.update(camposParaAtualizar, {
            where: { idLoja: id }
        });
        
        if (numRowsUpdated[0] === 0) {
            return res.status(404).json({ error: 'Loja não encontrada' });
        }

        // Busca a loja atualizada
        const lojaAtualizada = await Loja.findOne({
            where: { idLoja: id }
        });
        
        res.json({ message: 'Loja atualizada com sucesso', loja: lojaAtualizada });
    } catch (error) {
        console.error('Erro ao atualizar loja:', error);
        res.status(500).json({ error: 'Erro ao atualizar a loja' });
    }
});

module.exports = router;