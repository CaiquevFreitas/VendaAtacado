const { DataTypes, Model } = require('sequelize');
const sequelize = require('./database');

class Produto extends Model {}

Produto.init({
    idProduto: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    nomeProduto: { type: DataTypes.STRING(100) },
    imagem: { type: DataTypes.STRING(100) },
    descricao: { type: DataTypes.STRING(300) },
    status: { type: DataTypes.BOOLEAN, defaultValue: true},
    categoria: { type: DataTypes.ENUM('Frutas','Vegetais','Doces','Almoço','Bebidas','Verduras', 'Carnes','Limpeza', 'Bolos', 'Salgados') },
    preco: { type: DataTypes.DOUBLE },
    estoque: { type: DataTypes.INTEGER },
    fk_idLoja: { type: DataTypes.INTEGER, allowNull: false},
}, { sequelize, modelName: 'Produto', tableName: 'produto', timestamps: false });

module.exports = Produto;
