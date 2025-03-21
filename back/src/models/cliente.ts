import { DataTypes, Model } from 'sequelize';
import sequelize from './database';

class Cliente extends Model {
    public idCliente!: number;
    public nomeCliente!: string;
    public email!: string;
    public cpf!: string;
    public telefone!: string;
    public dataNascimento!: Date;
}

Cliente.init({
    idCliente: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    nomeCliente: { type: DataTypes.STRING(255), allowNull: false },
    email: { type: DataTypes.STRING(100), allowNull: false },
    cpf: { type: DataTypes.CHAR(11), allowNull: false, unique: true },
    telefone: { type: DataTypes.CHAR(11), allowNull: false, unique: true },
    dataNascimento: { type: DataTypes.DATE, allowNull: false },
}, { sequelize, modelName: 'Cliente' });

export { Cliente };
