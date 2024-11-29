import { DataTypes } from 'sequelize';

export const AppointmentModel = (sequelize) => {
  const attributes = {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    patient_id: DataTypes.INTEGER,
    doctor_id: DataTypes.INTEGER,
    appointment_taken_date: DataTypes.DATE,
    actual_start_time: DataTypes.DATE,
    actual_end_time: DataTypes.DATE,
    expected_end_time: DataTypes.DATE,
    reason_for_visit: DataTypes.TEXT,
    status: DataTypes.STRING,
  };
  const options = {
    tableName: 'appointment',
    timestamps: true,
    createdAt: 'create_time',
    updatedAt: 'update_time',
  };

  const Appointment = sequelize.define('Appointment', attributes, options);

  return Appointment;
};
