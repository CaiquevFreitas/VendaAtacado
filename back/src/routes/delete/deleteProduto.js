const express = require('express');
const path = require('path');
const fs = require('fs');
const Produto = require('../../models/produto');
const router = express.Router();

router.delete('/deletarProduto/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const produto = await Produto.findByPk(id);
        
        if (!produto) {
            return res.status(404).json({ 
                message: 'Produto não encontrado' 
            });
        }

        await Produto.destroy({
            where: { idProduto: id }
        });


        if (produto.imagem) {
            const imagePath = path.join(__dirname, '../../../', produto.imagem);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }

        res.status(200).json({ 
            message: 'Produto deletado com sucesso' 
        });
    } catch (error) {
        console.error('Erro ao deletar produto:', error);
        res.status(500).json({ 
            message: 'Erro ao deletar produto', 
            error: error.message 
        });
    }
});

module.exports = router;
