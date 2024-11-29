import { DataTypes } from 'sequelize';

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
      tableName: 'doctor',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );

  // Associate Doctor with other models here
  Doctor.associate = (models) => {
    Doctor.hasMany(models.MedicalRecord, {
      foreignKey: 'doctor_id',
      // as: 'medicalRecords',
    });
    Doctor.hasMany(models.Appointment, {
      foreignKey: 'doctor_id',
      // as: 'appointments',
    });
    Doctor.hasMany(models.Prescription, {
      foreignKey: 'doctor_id',
      // as: 'prescriptions',
    });
    Doctor.hasMany(models.DoctorAvailability, {
      foreignKey: 'doctor_id',
      // as: 'doctorAvailabilities',
    });
    // Doctor.belongsToMany(models.Specialization, {
    //   through: 'DoctorSpecialization',
    // });
  };
  return Doctor;
};
