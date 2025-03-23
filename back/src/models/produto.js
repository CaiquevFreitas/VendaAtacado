const { DataTypes, Model } = require('sequelize');
const sequelize = require('./database');

class Produto extends Model {}

Produto.init({
    idProduto: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    nomeProduto: { type: DataTypes.STRING(100) },
    categoria: { type: DataTypes.STRING(100) },
    preco: { type: DataTypes.DOUBLE },
    estoque: { type: DataTypes.INTEGER },
    fk_idLoja: { type: DataTypes.INTEGER, allowNull: false, references: { model: Loja, key: 'idLoja' } },
}, { sequelize, modelName: 'Produto' });

module.exports = Produto;
