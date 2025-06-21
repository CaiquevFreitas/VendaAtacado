const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Loja = require('../../models/loja');
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

router.post('/editLogo/:idLoja', upload.single('logo'), async (req, res) => {
    try {
        const { idLoja } = req.params;
        const loja = await Loja.findByPk(idLoja);
        if (!loja) {
            if (req.file) fs.unlinkSync(req.file.path);
            return res.status(404).json({ message: 'Loja não encontrada.' });
        }
        const logo = req.file ? `/uploads/${req.file.filename}` : loja.logo;
        
        if (req.file && loja.logo && loja.logo !== logo) {
            const oldPath = path.join(uploadsDir, path.basename(loja.logo));
            if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
        }
        loja.logo = logo;
        await loja.save();
        res.json({ message: 'Logo atualizada com sucesso!', logo: loja.logo });
    } catch (error) {
        if (req.file) fs.unlinkSync(req.file.path);
        console.error('Erro ao atualizar logo:', error);
        res.status(500).json({ message: 'Erro ao atualizar logo', error: error.message });
    }
});

module.exports = router;
