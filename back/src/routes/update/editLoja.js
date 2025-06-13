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
        
        
        const camposParaAtualizar = {};
        
        if (nome !== undefined && nome !== null && nome.trim() !== '') {
            camposParaAtualizar.nomeLoja = nome;
        }
        
        if (horarioAbertura !== undefined && horarioAbertura !== null && horarioAbertura.trim() !== '') {
            camposParaAtualizar.horarioAbertura = horarioAbertura;
        }
        
        if (horarioFechamento !== undefined && horarioFechamento !== null && horarioFechamento.trim() !== '') {
            camposParaAtualizar.horarioFechamento = horarioFechamento;
        }
        
        if (telefone !== undefined && telefone !== null && telefone.trim() !== '') {
            camposParaAtualizar.telefone = telefone;
        }
        
        if (senha !== undefined && senha !== null && senha.trim() !== '') {
            camposParaAtualizar.senha = senha;
        }
        
        
        const numRowsUpdated = await Loja.update(camposParaAtualizar, {
            where: { idLoja: id }
        });
        
        const lojaExiste = await Loja.findOne({
            where: { idLoja: id }
        });

        if (!lojaExiste) {
            return res.status(404).json({ error: 'Loja não encontrada' });
        }

        
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