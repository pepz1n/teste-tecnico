import { DataTypes } from 'sequelize';
import sequelize from '../config';
import PadraoLugares from './PadraoLugares.js';

const Sala = sequelize.define(
  'salas',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    observacao: {
      type: DataTypes.STRING(500),
    },
  },
  {
    freezeTableName: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
);

Sala.belongsTo(PadraoLugares, {
  as: 'padraoLugares',
  onDelete: 'NO ACTION',
  onUpdate: 'NO ACTION',
  foreignKey: {
    name: 'idPadraoLugares',
    allowNull: false,
    field: 'id_padrao_lugares',
  },
});

export default Sala;
