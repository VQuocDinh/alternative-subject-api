import { DataTypes } from 'sequelize';

module.exports = (sequelize) => {
  const Medicine = sequelize.define(
    'Medicine',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      dosage: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
      },
      storage_condition: {
        type: DataTypes.TEXT,
      },
      warnings: {
        type: DataTypes.TEXT,
      },
      contraindications: {
        type: DataTypes.TEXT,
      },
    },
    {
      tableName: 'medicine',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );

  Medicine.associate = (models) => {
    Medicine.belongsToMany(models.Prescription, {
      through: models.PrescriptionMedicine,
      foreignKey: 'medicine_id',
      as: 'Prescriptions',
    });
  };

  return Medicine;
};
