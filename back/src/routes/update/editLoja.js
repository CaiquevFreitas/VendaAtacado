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
        } = req.query;
        
        // Cria um objeto com apenas os campos que devem ser atualizados
        const camposParaAtualizar = {};
        
        if (nome) {
            camposParaAtualizar.nome = nome;
        }
        
        if (horarioAbertura) {
            camposParaAtualizar.horarioAbertura = new Date(horarioAbertura);
        }
        
        if (horarioFechamento) {
            camposParaAtualizar.horarioFechamento = new Date(horarioFechamento);
        }
        
        if (telefone) {
            camposParaAtualizar.telefone = telefone;
        }
        
        if (senha) {
            camposParaAtualizar.senha = senha;
        }
        
        // Atualiza apenas os campos necessários
        const lojaAtualizada = await Loja.findByIdAndUpdate(
            id,
            { $set: camposParaAtualizar },
            { new: true }
        );
        
        if (!lojaAtualizada) {
            return res.status(404).json({ error: 'Loja não encontrada' });
        }
        
        res.json({ message: 'Loja atualizada com sucesso', loja: lojaAtualizada });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao atualizar a loja' });
    }
});

module.exports = router;