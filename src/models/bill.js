const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  const Bill = sequelize.define('bill', {
    bill_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    patient_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'patients',
        key: 'patient_id'
      }
    },
    total_amount: {
      type: DataTypes.DECIMAL(10,2),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'bill',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "bill_id" },
        ]
      },
      {
        name: "fk_patients_idx",
        using: "BTREE",
        fields: [
          { name: "patient_id" },
        ]
      },
    ]
  });
  Bill.associate = function(models) {
    Bill.hasMany(models.patient_records, { foreignKey: 'bill_id'});
  };
  return Bill
};
