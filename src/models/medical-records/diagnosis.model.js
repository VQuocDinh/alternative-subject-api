module.exports = (sequelize, DataTypes) => {
  const Diagnosis = sequelize.define(
    'Diagnosis',
    {
      doctor_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      medical_record_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      disease_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      icd10_code: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      treatment_plan: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      symptoms: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      taken_time: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      note: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      tableName: 'diagnosis',
      timestamps: false,
      underscored: true,
    }
  );

  return Diagnosis;
};
