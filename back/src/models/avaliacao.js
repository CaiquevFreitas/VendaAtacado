const { DataTypes, Model } = require('sequelize');
const sequelize = require('./database');
const Produto = require('./produto');
const Cliente = require('./cliente');
const Loja = require('./loja');


class Avaliacao extends Model {}
Avaliacao.init({
    idAvaliacao: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    nota: { type: DataTypes.INTEGER, allowNull: false },
    comentario: { type: DataTypes.STRING(100) },
    fk_idProduto: { type: DataTypes.INTEGER, references: { model: Produto, key: 'idProduto' } },
    fk_idCliente: { type: DataTypes.INTEGER, allowNull: false, references: { model: Cliente, key: 'idCliente' } },
    fk_idLoja: { type: DataTypes.INTEGER, references: { model: Loja, key: 'idLoja' } },
}, { sequelize, modelName: 'Avaliacao', tableName: 'avaliacao', timestamps: false });

module.exports = Avaliacao;