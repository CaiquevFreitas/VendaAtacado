const { DataTypes, Model } = require('sequelize');
const sequelize = require('./database');


class Avaliacao extends Model {}
Avaliacao.init({
    idAvaliacao: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    nota: { type: DataTypes.INTEGER, allowNull: false },
    comentario: { type: DataTypes.STRING(100) },
    fk_idProduto: { type: DataTypes.INTEGER, allowNull: false, references: { model: Produto, key: 'idProduto' } },
    fk_idCliente: { type: DataTypes.INTEGER, allowNull: false, references: { model: Cliente, key: 'idCliente' } },
}, { sequelize, modelName: 'Avaliacao' });

module.exports = Avaliacao;