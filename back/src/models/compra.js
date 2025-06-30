const { DataTypes, Model } = require('sequelize');
const sequelize = require('./database');
const Cliente = require('./cliente');
const Pedido = require('./pedido');

class Compra extends Model {}
Compra.init({
    idCompra: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    dataCompra: { type: DataTypes.DATE, allowNull: false },
    fk_idCliente: { type: DataTypes.INTEGER, allowNull: false, references: { model: Cliente, key: 'idCliente' } },
    fk_idPedido: { type: DataTypes.INTEGER, allowNull: false, references: { model: Pedido, key: 'idPedido' } },
}, { sequelize, modelName: 'Compra', tableName: 'compra', timestamps: false });

module.exports = Compra;    