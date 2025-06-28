const { DataTypes, Model } = require('sequelize');
const sequelize = require('./database');
const Cliente = require('./cliente');
const Loja = require('./loja');

class Pedido extends Model {}
Pedido.init({
    idPedido: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    total: { type: DataTypes.DOUBLE, defaultValue: 0 },
    status: { type: DataTypes.ENUM('Em Processamento', 'Em preparo', 'Pronto', 'Entregue', 'Cancelado'), defaultValue: 'Em Processamento' },
    fk_idCliente: { type: DataTypes.INTEGER, allowNull: false, references: { model: Cliente, key: 'idCliente' } },
    fk_idLoja: { type: DataTypes.INTEGER, allowNull: false, references: { model: Loja, key: 'idLoja' } },
}, { sequelize, modelName: 'Pedido', tableName: 'pedido', timestamps: false });

module.exports = Pedido;