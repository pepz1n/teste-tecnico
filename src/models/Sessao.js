import { DataTypes } from 'sequelize';
import sequelize from '../config';
import Filme from './Filme';
import Sala from './Sala';

const Sessao = sequelize.define(
  'sessoes',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    lugares: {
      type: DataTypes.JSONB,
      allowNull: false,
    },
    dataInicio: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'data_inicio',
    },
    dataFim: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'data_fim',
    },
    preco: {
      type: DataTypes.NUMERIC,
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
  },
);

Sessao.belongsTo(Sala, {
  as: 'sala',
  onDelete: 'NO ACTION',
  onUpdate: 'NO ACTION',
  foreignKey: {
    name: 'idSala',
    allowNull: false,
    field: 'id_sala',
  },
});

Sessao.belongsTo(Filme, {
  as: 'filme',
  onDelete: 'NO ACTION',
  onUpdate: 'NO ACTION',
  foreignKey: {
    name: 'idFilme',
    allowNull: false,
    field: 'id_filme',
  },
});

export default Sessao;
