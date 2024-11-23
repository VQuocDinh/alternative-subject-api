const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('record_indicators', {
    record_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'medical_records',
        key: 'id'
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
    },
    date_update: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    value: {
      type: DataTypes.STRING(45),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'record_indicators',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "record_id" },
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
