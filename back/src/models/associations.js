const Loja = require('./loja');
const Avaliacao = require('./avaliacao');
const Cliente = require('./cliente');
const Produto = require('./produto');

// Definir associações
Loja.hasMany(Avaliacao, {
    foreignKey: 'fk_idLoja',
    as: 'Avaliacoes'
});

Avaliacao.belongsTo(Loja, {
    foreignKey: 'fk_idLoja',
    as: 'Loja'
});

Cliente.hasMany(Avaliacao, {
    foreignKey: 'fk_idCliente',
    as: 'Avaliacoes'
});

Avaliacao.belongsTo(Cliente, {
    foreignKey: 'fk_idCliente',
    as: 'Cliente'
});

Produto.hasMany(Avaliacao, {
    foreignKey: 'fk_idProduto',
    as: 'Avaliacoes'
});

Avaliacao.belongsTo(Produto, {
    foreignKey: 'fk_idProduto',
    as: 'Produto'
});

module.exports = {
    Loja,
    Avaliacao,
    Cliente,
    Produto
}; 