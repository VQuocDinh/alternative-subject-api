import { DataTypes } from 'sequelize';

module.exports = (sequelize) => {
  const OAuth = sequelize.define(
    'OAuth',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      patient_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      provider: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      provider_id: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      access_token: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      refresh_token: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      tableName: 'oauth',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );

  return OAuth;
};
