module.exports = (sequelize, DataTypes) => {
  const MedicalRecord = sequelize.define(
    'MedicalRecord',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      patient_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        // references: { model: 'Patient', key: 'id' },
      },
      doctor_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        // references: { model: 'Doctor', key: 'id' },
      },
      diagnosis: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      symptoms: {
        type: DataTypes.TEXT,
      },
      treatment_plan: {
        type: DataTypes.TEXT,
      },
      status: {
        type: DataTypes.STRING,
        // defaultValue: 'in_treatment',
      },
    },
    {
      tableName: 'medical_record',
      timestamps: true,
      underscored: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );

  MedicalRecord.associate = (models) => {
    MedicalRecord.belongsTo(
      models.Patient
      //   {
      //   foreignKey: 'patient_id',
      //   as: 'patient',
      // }
    );

    MedicalRecord.belongsTo(
      models.Doctor
      //   {
      //   foreignKey: 'doctor_id',
      //   as: 'doctor',
      // }
    );

    MedicalRecord.hasMany(models.VitalSign, {
      foreignKey: 'medical_record_id',
      // as: 'vitalSigns',
    });

    MedicalRecord.hasMany(models.Prescription, {
      foreignKey: 'medical_record_id',
      // as: 'prescriptions',
    });

    MedicalRecord.belongsToMany(models.Lab, {
      through: 'MedicalRecordLab',
    });
  };

  return MedicalRecord;
};
