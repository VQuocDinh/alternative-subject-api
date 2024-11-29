module.exports = (sequelize, DataTypes) => {
  const Prescription = sequelize.define(
    'Prescription',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      medical_record_id: {
        type: DataTypes.INTEGER,
        // allowNull: false,
        // references: { model: 'MedicalRecord', key: 'id' },
      },
      doctor_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        // references: { model: 'Doctor', key: 'id' },
      },
      prescribed_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      notes: {
        type: DataTypes.TEXT,
      },
    },
    {
      tableName: 'prescription',
      timestamps: true,
      underscored: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );

  Prescription.associate = (models) => {
    Prescription.belongsTo(models.MedicalRecord);
    Prescription.belongsTo(models.Doctor);
    Prescription.belongsToMany(models.Medicine, {
      through: 'PrescriptionMedicine',
      // as: 'prescriptionMedicines',
    });
  };

  return Prescription;
};
