const { DataTypes, Model } = require('sequelize');
const sequelize = require('./database');

class Carrinho extends Model {}
Carrinho.init({
    idCarrinho: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    totalCarrinho: { type: DataTypes.DOUBLE, allowNull: false },
    fk_idCliente: { type: DataTypes.INTEGER, allowNull: false, references: { model: Cliente, key: 'idCliente' } },
}, { sequelize, modelName: 'Carrinho' });

module.exports = Carrinho;