const Loja = require('./loja');
const Avaliacao = require('./avaliacao');
const Cliente = require('./cliente');
const Produto = require('./produto');
const Carrinho = require('./carrinho');
const ItemCarrinho = require('./itemCarrinho');
const Pedido = require('./pedido');
const ItemPedido = require('./itemPedido');
const Compra = require('./compra');

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

// Associações do Carrinho
Cliente.hasOne(Carrinho, {
    foreignKey: 'fk_idCliente',
    as: 'Carrinho'
});

Carrinho.belongsTo(Cliente, {
    foreignKey: 'fk_idCliente',
    as: 'Cliente'
});

Carrinho.hasMany(ItemCarrinho, {
    foreignKey: 'fk_idCarrinho',
    as: 'Itens'
});

ItemCarrinho.belongsTo(Carrinho, {
    foreignKey: 'fk_idCarrinho',
    as: 'Carrinho'
});

Produto.hasMany(ItemCarrinho, {
    foreignKey: 'fk_idProduto',
    as: 'ItensCarrinho'
});

ItemCarrinho.belongsTo(Produto, {
    foreignKey: 'fk_idProduto',
    as: 'Produto'
});

// Associações do Pedido
Cliente.hasMany(Pedido, {
    foreignKey: 'fk_idCliente',
    as: 'Pedidos'
});

Pedido.belongsTo(Cliente, {
    foreignKey: 'fk_idCliente',
    as: 'Cliente'
});

Loja.hasMany(Pedido, {
    foreignKey: 'fk_idLoja',
    as: 'Pedidos'
});

Pedido.belongsTo(Loja, {
    foreignKey: 'fk_idLoja',
    as: 'Loja'
});

Pedido.hasMany(ItemPedido, {
    foreignKey: 'fk_idPedido',
    as: 'Itens'
});

ItemPedido.belongsTo(Pedido, {
    foreignKey: 'fk_idPedido',
    as: 'Pedido'
});

Produto.hasMany(ItemPedido, {
    foreignKey: 'fk_idProduto',
    as: 'ItensPedido'
});

ItemPedido.belongsTo(Produto, {
    foreignKey: 'fk_idProduto',
    as: 'Produto'
});

// Associações da Compra
Cliente.hasMany(Compra, {
    foreignKey: 'fk_idCliente',
    as: 'Compras'
});

Compra.belongsTo(Cliente, {
    foreignKey: 'fk_idCliente',
    as: 'Cliente'
});

Pedido.hasOne(Compra, {
    foreignKey: 'fk_idPedido',
    as: 'Compra'
});

Compra.belongsTo(Pedido, {
    foreignKey: 'fk_idPedido',
    as: 'Pedido'
});

module.exports = {
    Loja,
    Avaliacao,
    Cliente,
    Produto,
    Carrinho,
    ItemCarrinho,
    Pedido,
    ItemPedido,
    Compra
}; 