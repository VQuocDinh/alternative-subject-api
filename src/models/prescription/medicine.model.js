import { DataTypes } from 'sequelize';

export const Medicine = (sequelize) => {
  const attributes = {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    dosage: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: DataTypes.TEXT,
    storage_condition: DataTypes.TEXT,
    warnings: DataTypes.TEXT,
    contraindications: DataTypes.TEXT,
  };

  const options = {
    tableName: 'medicine',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  };

  return sequelize.define('Medicine', attributes, options);
};
