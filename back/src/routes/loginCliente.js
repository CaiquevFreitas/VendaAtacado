const express = require('express');
const Cliente = require('../models/cliente');
const router = express.Router();

router.post('/loginCliente', async(req,res) =>{
    const {email, senha} = req.body
    console.log(`Email: ${email}, senha:${senha}`);

    const user = await Cliente.findOne({
        where: {email: email}
    })
    
    if (user == null){
            res.status(200).json({ message: 'usuário não encontrado.' });
            return;
    }

    if(user.senha != senha){
        res.status(200).json({ message: 'senha incorreta.'});
        return;
    }

    res.status(200).json({message:'Tudo certo'})
})

module.exports = router;
