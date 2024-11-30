import { DataTypes } from 'sequelize';

module.exports = (sequelize) => {
  const Lab = sequelize.define(
    'Lab',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      lab_name: DataTypes.STRING,
      location: DataTypes.STRING,
      contact_number: DataTypes.STRING,
      available_test: DataTypes.TEXT,
    },
    {
      tableName: 'lab',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );

  return Lab;
};
