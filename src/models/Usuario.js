import { DataTypes } from 'sequelize';
import sequelize from '../config';
import Cargo from './Cargo';

const Usuario = sequelize.define(
  'usuarios',
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
    email: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    cpf: {
      type: DataTypes.STRING(14),
      allowNull: false,
      unique: true,
    },
    estudante: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
  },
);

Usuario.belongsTo(Cargo, {
  as: 'cargo',
  onDelete: 'NO ACTION',
  onUpdate: 'NO ACTION',
  foreignKey: {
    name: 'idCargo',
    allowNull: false,
    field: 'id_cargo',
  },
});

export default Usuario;
