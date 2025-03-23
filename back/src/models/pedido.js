const { DataTypes, Model } = require('sequelize');
const sequelize = require('./database');

class Pedido extends Model {}
Pedido.init({
    idPedido: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    total: { type: DataTypes.DOUBLE, allowNull: false },
    status: { type: DataTypes.ENUM('Em Processamento', 'Enviado', 'Entregue', 'Cancelado') },
    fk_idCliente: { type: DataTypes.INTEGER, allowNull: false, references: { model: Cliente, key: 'idCliente' } },
    fk_idLoja: { type: DataTypes.INTEGER, allowNull: false, references: { model: Loja, key: 'idLoja' } },
}, { sequelize, modelName: 'Pedido' });

module.exports = Pedido;