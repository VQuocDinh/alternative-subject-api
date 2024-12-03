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
      },
      doctor_id: {
        type: DataTypes.INTEGER,
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

  return MedicalRecord;
};
