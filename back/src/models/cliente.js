const { DataTypes, Model } = require('sequelize');
const sequelize = require('./database');

class Cliente extends Model {}

Cliente.init({
    idCliente: { 
        type: DataTypes.INTEGER, 
        autoIncrement: true, 
        primaryKey: true 
    },
    nomeCliente: { 
        type: DataTypes.STRING(255), 
        allowNull: false 
    },
    foto: { 
        type: DataTypes.STRING(100), 
        allowNull: true 
    },  
    email: { 
        type: DataTypes.STRING(100), 
        allowNull: false 
    },
    cpf: { 
        type: DataTypes.CHAR(11), 
        allowNull: false, 
        unique: true 
    },
    telefone: { 
        type: DataTypes.CHAR(11), 
        allowNull: false, 
        unique: true 
    },
    dataNascimento: { 
        type: DataTypes.DATE, 
        allowNull: false 
    },
    senha: {
        type: DataTypes.CHAR(8),
        allowNull: false
    }
}, { 
    sequelize, 
    modelName: 'Cliente',
    tableName: 'cliente', 
    timestamps: false      
});

module.exports = Cliente;
