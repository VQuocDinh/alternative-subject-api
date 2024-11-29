module.exports = (sequelize, DataTypes) => {
  const MedicationSchedule = sequelize.define(
    'MedicationSchedule',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      prescription_medicine_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'PrescriptionMedicine', key: 'id' },
      },
      schedule_time: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      reminder_enabled: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
    },
    {
      tableName: 'medication_schedule',
      timestamps: true,
      underscored: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );
  MedicationSchedule.associate = (models) => {
    MedicationSchedule.belongsTo(models.PrescriptionMedicine, {
      foreignKey: 'prescription_medicine_id',
      as: 'prescriptionMedicine',
    });
    MedicationSchedule.hasMany(models.MedicationHistory, {
      foreignKey: 'schedule_id',
      as: 'medicationHistories',
    });
  };

  return MedicationSchedule;
};
