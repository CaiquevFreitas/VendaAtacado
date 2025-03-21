import { DataTypes, Model } from 'sequelize';
import sequelize from './database';

class Produto extends Model {
    public idProduto!: number;
    public nomeProduto!: string;
    public categoria!: string;
    public preco!: number;
    public estoque!: number;
    public fk_idLoja!: number;
}

Produto.init({
    idProduto: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    nomeProduto: { type: DataTypes.STRING(100) },
    categoria: { type: DataTypes.STRING(100) },
    preco: { type: DataTypes.DOUBLE },
    estoque: { type: DataTypes.INTEGER },
    fk_idLoja: { type: DataTypes.INTEGER, allowNull: false, references: { model: Loja, key: 'idLoja' } },
}, { sequelize, modelName: 'Produto' });

export { Produto };
