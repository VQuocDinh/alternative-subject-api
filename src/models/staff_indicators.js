const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('staff_indicators', {
    staff_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'staff',
        key: 'staff_id'
      }
    },
    indicator_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'health_indicators',
        key: 'indicator_id'
      }
    }
  }, {
    sequelize,
    tableName: 'staff_indicators',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "staff_id" },
          { name: "indicator_id" },
        ]
      },
      {
        name: "indicator_id",
        using: "BTREE",
        fields: [
          { name: "indicator_id" },
        ]
      },
    ]
  });
};
