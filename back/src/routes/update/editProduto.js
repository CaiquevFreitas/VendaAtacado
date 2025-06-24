const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Produto = require('../../models/produto');
const router = express.Router();

const uploadsDir = path.join(__dirname, '../../../uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadsDir),
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage: storage,
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png/;
        if (filetypes.test(file.mimetype) && filetypes.test(path.extname(file.originalname).toLowerCase())) {
            return cb(null, true);
        }
        cb(new Error('Apenas imagens são permitidas!'));
    }
});

router.put('/editProduto/:idProduto', upload.single('imagem'), async (req, res) => {
    try {
        const { idProduto } = req.params;
        const { nomeProduto, categoria, preco, estoque, status } = req.body;
        
        const produto = await Produto.findByPk(idProduto);
        if (!produto) {
            if (req.file) fs.unlinkSync(req.file.path);
            return res.status(404).json({ message: 'Produto não encontrado.' });
        }

        const imagemPath = req.file ? `/uploads/${req.file.filename}` : produto.imagem;

        if (req.file && produto.imagem) {
            const oldPath = path.join(uploadsDir, path.basename(produto.imagem));
            if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
        }
        
        await produto.update({
            nomeProduto,
            categoria,
            preco,
            estoque,
            status: status === 'true' || status === true,
            imagem: imagemPath
        });

        res.json({ message: 'Produto atualizado com sucesso!', produto });
    } catch (error) {
        if (req.file) fs.unlinkSync(req.file.path);
        console.error('Erro ao editar produto:', error);
        res.status(500).json({ message: 'Erro ao editar produto', error: error.message });
    }
});

module.exports = router;
