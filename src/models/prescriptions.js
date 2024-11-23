const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('prescriptions', {
    prescription_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    prescribed_date: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    notes: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    patient_records_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'patient_records',
        key: 'patient_records_id'
      }
    },
    staff_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'staff',
        key: 'staff_id'
      }
    }
  }, {
    sequelize,
    tableName: 'prescriptions',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "prescription_id" },
        ]
      },
      {
        name: "fk_staff_idx",
        using: "BTREE",
        fields: [
          { name: "staff_id" },
        ]
      },
      {
        name: "fk_patient_records_idx",
        using: "BTREE",
        fields: [
          { name: "patient_records_id" },
        ]
      },
    ]
  });
};
