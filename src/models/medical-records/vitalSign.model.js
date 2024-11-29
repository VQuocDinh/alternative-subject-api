module.exports = (sequelize, DataTypes) => {
  const VitalSigns = sequelize.define(
    'VitalSigns',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      medical_record_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      temperature: {
        type: DataTypes.DECIMAL,
        allowNull: false,
      },
      blood_pressure: {
        type: DataTypes.STRING,
      },
      heart_rate: {
        type: DataTypes.INTEGER,
      },
      respiratory_rate: {
        type: DataTypes.INTEGER,
      },
      weight: {
        type: DataTypes.DECIMAL,
      },
      height: {
        type: DataTypes.DECIMAL,
      },
      create_at: {
        type: DataTypes.DATE,
      },
      update_at: {
        type: DataTypes.DATE,
      },
    },
    {
      tableName: 'vital_signs',
      timestamps: false,
      underscored: true,
    }
  );

  return VitalSigns;
};
