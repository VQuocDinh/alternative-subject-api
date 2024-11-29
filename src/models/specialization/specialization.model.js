import { DataTypes } from 'sequelize';

export const Specialization = (sequelize) => {
  const attributes = {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    specialization_name: DataTypes.STRING,
  };
  const options = {
    tableName: 'specialization',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  };
  return sequelize.define('Specialization', attributes, options);
};
