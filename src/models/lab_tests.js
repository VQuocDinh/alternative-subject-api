const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('lab_tests', {
    test_id: {
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
    test_name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    test_date: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    result: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    normal_range: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    requested_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'staff',
        key: 'staff_id'
      }
    },
    performed_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'staff',
        key: 'staff_id'
      }
    }
  }, {
    sequelize,
    tableName: 'lab_tests',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "test_id" },
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
        name: "requested_by",
        using: "BTREE",
        fields: [
          { name: "requested_by" },
        ]
      },
      {
        name: "performed_by",
        using: "BTREE",
        fields: [
          { name: "performed_by" },
        ]
      },
    ]
  });
};
