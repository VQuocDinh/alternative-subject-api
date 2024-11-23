const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('bill_detail', {
    bill_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'bill',
        key: 'bill_id'
      }
    },
    cost_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'costs',
        key: 'cost_id'
      }
    }
  }, {
    sequelize,
    tableName: 'bill_detail',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "bill_id" },
          { name: "cost_id" },
        ]
      },
      {
        name: "bill_detail_ibfk_2_idx",
        using: "BTREE",
        fields: [
          { name: "cost_id" },
        ]
      },
    ]
  });
};
