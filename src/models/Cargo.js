import { DataTypes } from 'sequelize';
import sequelize from '../config';

const Cargo = sequelize.define(
  'cargos',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    descricao: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
  },
);

export default Cargo;
