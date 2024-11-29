const { DataTypes } = require('sequelize');

const DoctorAvailability = (sequelize) => {
  const attributes = {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    doctor_id: DataTypes.INTEGER,
    day_of_week: DataTypes.STRING,
    start_time: DataTypes.DATE,
    end_time: DataTypes.DATE,
    is_available: DataTypes.BOOLEAN,
  };

  const options = {
    tableName: 'doctor_availability',
    timestamps: true,
    createdAt: 'create_time',
    updatedAt: 'update_time',
  };

  return sequelize.define('DoctorAvailability', attributes, options);
};
