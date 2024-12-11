// models/PrescriptionMedicine.js
module.exports = (sequelize, DataTypes) => {
  const PrescriptionMedicine = sequelize.define(
    'PrescriptionMedicine',
    {
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      dosage: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      frequency: {
        type: DataTypes.STRING,
      },
      duration: {
        type: DataTypes.INTEGER,
      },
      instructions: {
        type: DataTypes.TEXT,
      },
    },
    {
      tableName: 'prescription_medicine',
      timestamps: true,
      underscored: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );

  return PrescriptionMedicine;
};
