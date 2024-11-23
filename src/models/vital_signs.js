const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  const VitalSigns = sequelize.define('vital_signs', {
    vital_sign_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    patient_records_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'patient_records',
        key: 'patient_records_id'
      }
    },
    temperature: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    blood_pressure: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    heart_rate: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    respiratory_rate: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    oxygen_saturation: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    measured_at: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    },
    measured_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'staff',
        key: 'staff_id'
      }
    },
    patient_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'patients',
        key: 'patient_id'
      }
    }
  }, {
    sequelize,
    tableName: 'vital_signs',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "vital_sign_id" },
        ]
      },
      {
        name: "patient_records_id",
        using: "BTREE",
        fields: [
          { name: "patient_records_id" },
        ]
      },
      {
        name: "measured_by",
        using: "BTREE",
        fields: [
          { name: "measured_by" },
        ]
      },
      {
        name: "vital_signs_ibfk_3_idx",
        using: "BTREE",
        fields: [
          { name: "patient_id" },
        ]
      },
    ]
  });
  VitalSigns.associate = function (models) {
    VitalSigns.belongsTo(models.staff, {foreignKey: "measured_by"})
  }
  return VitalSigns
};
