import { DataTypes } from 'sequelize';

module.exports = (sequelize) => {
  const Specialization = sequelize.define(
    'Specialization',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      specialization_name: DataTypes.STRING,
    },
    {
      tableName: 'specialization',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );

  return Specialization;
};
