const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const DoctorAvailability = sequelize.define(
    'DoctorAvailability',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      doctor_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      day_of_week: DataTypes.STRING,
      start_time: DataTypes.DATE,
      end_time: DataTypes.DATE,
      is_available: DataTypes.BOOLEAN,
    },
    {
      tableName: 'doctor_availability',
      timestamps: true,
      createdAt: 'create_time',
      updatedAt: 'update_time',
    }
  );

  return DoctorAvailability;
};
