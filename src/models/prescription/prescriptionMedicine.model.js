const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const PrescriptionMedicine = sequelize.define(
    'PrescriptionMedicine',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      prescription_id: {
        type: DataTypes.INTEGER,
        references: { model: 'Prescription', key: 'id' },
      },
      medicine_id: {
        type: DataTypes.INTEGER,
        references: { model: 'Medicine', key: 'id' },
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      dosage: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      frequency: DataTypes.STRING,
      duration: DataTypes.INTEGER,
      instructions: DataTypes.TEXT,
    },
    {
      tableName: 'prescription_medicine',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );

  PrescriptionMedicine.associate = (models) => {
    PrescriptionMedicine.belongsTo(models.Prescription, {
      foreignKey: 'prescription_id',
      as: 'prescription',
    });
    PrescriptionMedicine.belongsTo(models.Medicine, {
      foreignKey: 'medicine_id',
      as: 'medicine',
    });
    PrescriptionMedicine.hasMany(models.MedicationSchedule, {
      foreignKey: 'prescription_medicine_id',
      as: 'medicationSchedules',
    });
  };

  return PrescriptionMedicine;
};
