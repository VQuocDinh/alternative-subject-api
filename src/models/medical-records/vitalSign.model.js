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
      weight: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      height: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      heart_rate: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      respiratory_rate: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      blood_pressure: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      temperature: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      bmi: {
        type: DataTypes.FLOAT,
        allowNull: true,
      },
      note: {
        type: DataTypes.STRING,
        allowNull: true,
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
