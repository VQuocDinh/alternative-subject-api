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
    },
    {
      tableName: 'patient',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );

  Patient.associate = (models) => {
    Patient.hasMany(models.MedicalRecord, {
      foreignKey: 'patient_id',
      sourceKey: 'id',
      as: 'medicalRecords',
    });
    Patient.hasMany(models.Appointment, {
      foreignKey: 'patient_id',
      sourceKey: 'id',
      as: 'appointments',
    });
  };

  return Patient;
};
