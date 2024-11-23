const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('prescription_details', {
    medication_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'medications',
        key: 'medication_id'
      }
    },
    prescription_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'prescriptions',
        key: 'prescription_id'
      }
    }
  }, {
    sequelize,
    tableName: 'prescription_details',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "medication_id" },
          { name: "prescription_id" },
        ]
      },
      {
        name: "prescription_id",
        using: "BTREE",
        fields: [
          { name: "prescription_id" },
        ]
      },
    ]
  });
};
