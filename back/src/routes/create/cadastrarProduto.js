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
    destination: function (req, file, cb) {
        cb(null, uploadsDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage: storage,
    fileFilter: function (req, file, cb) {
        const filetypes = /jpeg|jpg|png/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error('Apenas imagens são permitidas!'));
    }
});

router.post('/cadastrarProduto', upload.single('imagem'), async (req, res) => {
    try {
        const { nomeProduto, categoria, preco, estoque, fk_idLoja, descricao } = req.body;
        const imagem = req.file ? `/uploads/${req.file.filename}` : null
        const produtoExistente = await Produto.findOne({
            where: {
                nomeProduto: nomeProduto,
                fk_idLoja: fk_idLoja
            }
        });
        if (produtoExistente) {
           
            if (req.file) {
                fs.unlinkSync(req.file.path);
            }
            return res.status(400).json({ 
                message: 'Já existe um produto com este nome nesta loja' 
            });
        }
        console.log(estoque)
        const novoProduto = new Produto({
            nomeProduto: nomeProduto,
            categoria,
            preco,
            estoque,
            descricao: descricao || null,
            imagem,
            fk_idLoja
        });

        await novoProduto.save();
        res.status(201).json({ message: 'Produto cadastrado com sucesso', produto: novoProduto });
    } catch (error) {
        // Se ocorrer um erro e existir um arquivo de imagem, removê-lo
        if (req.file) {
            fs.unlinkSync(req.file.path);
        }
        console.error('Erro ao cadastrar produto:', error);
        res.status(500).json({ message: 'Erro ao cadastrar produto', error: error.message });
    }
});

module.exports = router;