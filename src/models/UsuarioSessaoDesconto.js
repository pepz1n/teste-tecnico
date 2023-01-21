import { DataTypes } from 'sequelize';
import sequelize from '../config';
import Desconto from './Desconto';
import UsuarioSessao from './UsuarioSessao';

const UsuarioSessaoDesconto = sequelize.define(
  'usuario_sessoes_descontos',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
  },
);

UsuarioSessaoDesconto.belongsTo(UsuarioSessao, {
  as: 'usuarioSessao',
  onDelete: 'NO ACTION',
  onUpdate: 'NO ACTION',
  foreignKey: {
    name: 'idUsuarioSessao',
    allowNull: false,
    field: 'id_usuario_sessao',
  },
});

UsuarioSessaoDesconto.belongsTo(Desconto, {
  as: 'desconto',
  onDelete: 'NO ACTION',
  onUpdate: 'NO ACTION',
  foreignKey: {
    name: 'idDesconto',
    allowNull: false,
    field: 'id_desconto',
  },
});

export default UsuarioSessaoDesconto;
