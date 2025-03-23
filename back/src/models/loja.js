const { DataTypes, Model } = require('sequelize');
const sequelize = require('./database');

class Loja extends Model {}

Loja.init({
    idLoja: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    nomeVendedor: { type: DataTypes.STRING(255), allowNull: false },
    nomeLoja: { type: DataTypes.STRING(100), allowNull: false },
    logo: { type: DataTypes.STRING(1000) },
    email: { type: DataTypes.STRING(100), allowNull: false },
    telefone: { type: DataTypes.CHAR(11), allowNull: false, unique: true },
    cpf: { type: DataTypes.CHAR(11), allowNull: false, unique: true },
    senha: { type: DataTypes.CHAR(8), allowNull: false },
    horarioAbertura: { type: DataTypes.TIME, allowNull: false },
    horarioFechamento: { type: DataTypes.TIME, allowNull: false },
    dataNascimento: { type: DataTypes.DATE, allowNull: false },
    nota: { type: DataTypes.DOUBLE },
}, 
{ sequelize, modelName: 'Loja' });

module.exports =   Loja ;
