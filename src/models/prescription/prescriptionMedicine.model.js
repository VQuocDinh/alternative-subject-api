const db = require("..");

// models/PrescriptionMedicine.js
module.exports = (sequelize, DataTypes) => {
  const PrescriptionMedicine = sequelize.define(
    'PrescriptionMedicine',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      prescription_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: db.Prescription,
          key: 'id',
        },
      },
      medicine_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: db.Medicine,
          key: 'id',
        },
      },
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
      start_date: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: DataTypes.NOW,
      },
      end_date: {
        type: DataTypes.DATE,
        allowNull: true,
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

  PrescriptionMedicine.associate = (models) => {
    PrescriptionMedicine.belongsTo(models.Prescription, {
      foreignKey: 'prescription_id',
      as: 'Prescription',
    });
  
    PrescriptionMedicine.belongsTo(models.Medicine, {
      foreignKey: 'medicine_id',
      as: 'Medicine',
    });
  };
  

  return PrescriptionMedicine;
};
