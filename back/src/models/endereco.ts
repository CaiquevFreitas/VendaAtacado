import { DataTypes, Model } from 'sequelize';
import sequelize from 'database';

class Endereco extends Model {
    public idEndereco!: number;
    public estado!: string;
    public cidade!: string;
    public bairro!: string;
    public logradouro!: string;
    public cep?: string;
    public numero?: string;
    public fk_idLoja!: number;
}

Endereco.init({
    idEndereco: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    estado: { type: DataTypes.STRING(100), allowNull: false },
    cidade: { type: DataTypes.STRING(100), allowNull: false },
    bairro: { type: DataTypes.STRING(100), allowNull: false },
    logradouro: { type: DataTypes.STRING(100), allowNull: false },
    cep: { type: DataTypes.STRING(10) },
    numero: { type: DataTypes.STRING(5) },
    fk_idLoja: { type: DataTypes.INTEGER, allowNull: false, references: { model: Loja, key: 'idLoja' } },
}, { sequelize, modelName: 'Endereco' });

export { Endereco };
