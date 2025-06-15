const { DataTypes, Model } = require('sequelize');
const sequelize = require('./database');

class Produto extends Model {}

Produto.init({
    idProduto: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    nomeProduto: { type: DataTypes.STRING(100) },
    categoria: { type: DataTypes.ENUM('Frutas','Vegetais','Doces','Almoço','Bebidas','Verduras', 'Carnes','Limpeza', 'Bolos', 'Salgados') },
    preco: { type: DataTypes.DOUBLE },
    estoque: { type: DataTypes.INTEGER },
    fk_idLoja: { type: DataTypes.INTEGER, allowNull: false, references: { model: Loja, key: 'idLoja' } },
}, { sequelize, modelName: 'Produto', tableName: 'produto', timestamps: false });

module.exports = Produto;
