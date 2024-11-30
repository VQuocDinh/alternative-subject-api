module.exports = (sequelize, DataTypes) => {
  const MedicationHistory = sequelize.define(
    'MedicationHistory',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      schedule_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      taken_time: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      note: {
        type: DataTypes.TEXT,
      },
    },
    {
      tableName: 'medication_history',
      timestamps: true,
      underscored: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );

  return MedicationHistory;
};
