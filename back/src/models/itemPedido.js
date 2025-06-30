const { DataTypes, Model } = require('sequelize');
const sequelize = require('./database');
const Produto = require('./produto');
const Pedido = require('./pedido');

class ItemPedido extends Model {}
ItemPedido.init({
    idItemPedido: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    quantidade: { type: DataTypes.INTEGER, allowNull: false },
    precoUnitario: { type: DataTypes.DOUBLE, allowNull: false },
    fk_idProduto: { type: DataTypes.INTEGER, allowNull: false, references: { model: Produto, key: 'idProduto' } },
    fk_idPedido: { type: DataTypes.INTEGER, allowNull: false, references: { model: Pedido, key: 'idPedido' } },
}, { sequelize, modelName: 'ItemPedido', tableName: 'itemPedido', timestamps: false });

module.exports = ItemPedido;