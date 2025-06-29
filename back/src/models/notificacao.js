const { DataTypes, Model } = require('sequelize');
const sequelize = require('./database');
const Cliente = require('./cliente');
const Loja = require('./loja');

class Notificacao extends Model {}

Notificacao.init({
    idNotificacao: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    titulo: { type: DataTypes.STRING(100), allowNull: false },
    descricao: { type: DataTypes.STRING(200), allowNull: false },
    tipo: { type: DataTypes.ENUM('Avaliação', 'Promoção', 'Pedido', 'Sistema'), allowNull: false },
    dataNotificacao: { type: DataTypes.DATE, allowNull: false },
    fk_idCliente: { type: DataTypes.INTEGER, allowNull: true, references: { model: Cliente, key: 'idCliente' } },
    fk_idLoja: { type: DataTypes.INTEGER, allowNull: true, references: { model: Loja, key: 'idLoja' } },
}, { sequelize, modelName: 'Notificacao', tableName: 'notificacao', timestamps: false });

module.exports = Notificacao;