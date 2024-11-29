import { DataTypes } from 'sequelize';

module.exports;
module.exports = (sequelize) => {
  const Doctor = sequelize.define(
    'Doctor',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      first_name: DataTypes.STRING,
      last_name: DataTypes.STRING,
      phone_number: DataTypes.STRING,
    },
    {
      tableName: 'doctors',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );
  Doctor.associate = (models) => {
    Doctor.hasMany(models.MedicalRecord, {
      foreignKey: 'doctor_id',
      sourceKey: 'id',
      as: 'medicalRecords',
    });
    Doctor.hasMany(models.Appointment, {
      foreignKey: 'doctor_id',
      sourceKey: 'id',
      as: 'appointments',
    });
    Doctor.hasMany(models.Prescription, {
      foreignKey: 'doctor_id',
      sourceKey: 'id',
      as: 'prescriptions',
    });
    Doctor.hasMany(models.DoctorAvailability, {
      foreignKey: 'doctor_id',
      sourceKey: 'id',
      as: 'doctorAvailabilities',
    });
    Doctor.hasMany(models.DoctorSpecialization, {
      foreignKey: 'doctor_id',
      sourceKey: 'id',
      as: 'doctorSpecializations',
    });
  };
  return Doctor;
};
