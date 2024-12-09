import { DataTypes } from 'sequelize';

module.exports = (sequelize) => {
  const Patient = sequelize.define(
    'Patient',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      full_name: DataTypes.STRING,
      dob: DataTypes.STRING,
      phone: DataTypes.STRING,
      cccd: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
    },
    {
      tableName: 'patient',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );

  return Patient;
};
