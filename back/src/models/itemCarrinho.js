const { DataTypes, Model } = require('sequelize');
const sequelize = require('./database');

class ItemCarrinho extends Model {}
ItemCarrinho.init({
    idItemCarrinho: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    quantidade: { type: DataTypes.INTEGER, allowNull: false },
    precoUnitario: { type: DataTypes.DOUBLE, allowNull: false },
    fk_idProduto: { type: DataTypes.INTEGER, allowNull: false, references: { model: Produto, key: 'idProduto' } },
    fk_idCarrinho: { type: DataTypes.INTEGER, allowNull: false, references: { model: Carrinho, key: 'idCarrinho' } },
}, { sequelize, modelName: 'ItemCarrinho' });

module.exports = ItemCarrinho;