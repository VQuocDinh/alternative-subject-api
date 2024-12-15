import { DataTypes } from 'sequelize';

module.exports = (sequelize) => {
  const KeyToken = sequelize.define(
    'KeyToken',
    {
      fk_user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      privateKey: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      publicKey: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      refreshToken: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    },
    {
      tableName: 'tb_key_token',
      timestamps: true,
      createdAt: 'create_time',
      updatedAt: 'update_time',
    }
  );

  return KeyToken;
};
