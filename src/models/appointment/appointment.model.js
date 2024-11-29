import { DataTypes } from 'sequelize';

module.exports = (sequelize) => {
  const Appointment = sequelize.define(
    'Appointment',
    {
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
    },
    {
      tableName: 'appointment',
      timestamps: true,
      createdAt: 'create_time',
      updatedAt: 'update_time',
    }
  );

  Appointment.associate = (models) => {
    Appointment.belongsTo(models.Patient, {
      foreignKey: 'patient_id',
      as: 'patient',
    });
    Appointment.belongsTo(models.Doctor, {
      foreignKey: 'doctor_id',
      as: 'doctor',
    });
  };

  return Appointment;
};
