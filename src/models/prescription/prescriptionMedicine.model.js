import { DataTypes } from 'sequelize';

export const PrescriptionMedicine = (sequelize) => {
  const attributes = {
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
  };

  const options = {
    tableName: 'prescription_medicine',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  };

  return sequelize.define('PrescriptionMedicine', attributes, options);
};
