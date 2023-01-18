import { DataTypes } from 'sequelize';
import sequelize from '../config';

const Parametro = sequelize.define(
  'parametros',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    chave: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    valor: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
);

export default Parametro;
