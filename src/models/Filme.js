import { DataTypes } from 'sequelize';
import sequelize from '../config';

const Filme = sequelize.define(
  'filmes',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nome: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    descricao: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    autor: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    duracao: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
  },
);

export default Filme;
