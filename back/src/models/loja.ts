import { DataTypes, Model } from 'sequelize';
import sequelize from 'database';

class Loja extends Model {
    public idLoja!: number;
    public nomeVendedor!: string;
    public nomeLoja!: string;
    public logo?: string;
    public email!: string;
    public telefone!: string;
    public cpf!: string;
    public senha!: string;
    public horarioAbertura!: string;
    public horarioFechamento!: string;
    public dataNascimento!: Date;
    public nota?: number;
}

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
}, { sequelize, modelName: 'Loja' });

export { Loja };
