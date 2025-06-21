const { DataTypes, Model } = require('sequelize');
const sequelize = require('./database');
const Loja = require('./loja');

class Endereco extends Model {}

Endereco.init({
    idEndereco: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    estado: { type: DataTypes.STRING(100), allowNull: false },
    cidade: { type: DataTypes.STRING(100), allowNull: false },
    bairro: { type: DataTypes.STRING(100), allowNull: false },
    logradouro: { type: DataTypes.STRING(100), allowNull: false },
    cep: { type: DataTypes.STRING(10) },
    numero: { type: DataTypes.STRING(5) },
    fk_idLoja: { type: DataTypes.INTEGER, allowNull: false, references: { model: Loja, key: 'idLoja' } },
}, { sequelize, modelName: 'Endereco', tableName: 'endereco', timestamps: false });

module.exports =  Endereco ;
