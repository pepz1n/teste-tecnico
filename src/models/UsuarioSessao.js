import { DataTypes } from 'sequelize';
import sequelize from '../config';
import Sessao from './Sessao';
import Usuario from './Usuario';

const UsuarioSessao = sequelize.define(
  'usuario_sessoes',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    valorAtual: {
      type: DataTypes.NUMERIC,
      allowNull: false,
      field: 'valor_atual',
    },
  },
  {
    freezeTableName: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  },
);

UsuarioSessao.belongsTo(Sessao, {
  as: 'sessao',
  onDelete: 'NO ACTION',
  onUpdate: 'NO ACTION',
  foreignKey: {
    name: 'idSessao',
    allowNull: false,
    field: 'id_sessao',
  },
});

UsuarioSessao.belongsTo(Usuario, {
  as: 'usuario',
  onDelete: 'NO ACTION',
  onUpdate: 'NO ACTION',
  foreignKey: {
    name: 'idUsuario',
    allowNull: false,
    field: 'id_usuario',
  },
});

export default UsuarioSessao;
