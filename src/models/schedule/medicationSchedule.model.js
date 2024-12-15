// models/MedicationSchedule.js
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
      },
      schedule_time: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM('pending', 'completed', 'missed'),
        allowNull: false,
        defaultValue: 'pending'
      },
      reminder_enabled: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      taken_time: {
        type: DataTypes.DATE,
        allowNull: true
      },
      notes: {
        type: DataTypes.TEXT,
        allowNull: true
      }
    },
    {
      tableName: 'medication_schedule',
      timestamps: true,
      underscored: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );

  return MedicationSchedule;
};