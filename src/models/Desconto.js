import { DataTypes } from 'sequelize';
import sequelize from '../config';

const Desconto = sequelize.define(
  'descontos',
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
    porcentagem: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
  },
);

export default Desconto;
