import { DataTypes } from 'sequelize';

module.exports = (sequelize) => {
  const Disease = sequelize.define(
    'Disease',
    {
      code: {
        type: DataTypes.STRING,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      tableName: 'disease',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );

  return Disease;
};
