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
      },
      doctor_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      prescribed_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      notes: {
        type: DataTypes.TEXT,
      },
      status: {
        type: DataTypes.ENUM('active', 'completed', 'cancelled'),
        defaultValue: 'active',
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
    // Relationship with PrescriptionMedicine
    Prescription.hasMany(models.PrescriptionMedicine, {
      foreignKey: 'prescription_id',
      as: 'PrescriptionMedicines',
    });

    // Relationship with Medicine through PrescriptionMedicine
    Prescription.belongsToMany(models.Medicine, {
      through: models.PrescriptionMedicine,
      foreignKey: 'prescription_id',
      otherKey: 'medicine_id',
      as: 'Medicines',
    });
  };

  return Prescription;
};
