const { DataTypes, Model } = require('sequelize');
const sequelize = require('./database');
const Cliente = require('./cliente');

class Carrinho extends Model {}
Carrinho.init({
    idCarrinho: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    fk_idCliente: { type: DataTypes.INTEGER, allowNull: false, references: { model: Cliente, key: 'idCliente' } },
}, { sequelize, modelName: 'Carrinho', tableName: 'carrinho', timestamps: false });

module.exports = Carrinho;