const Sequelize = require("sequelize");
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "medical_records",
    {
      id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      patient_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "patients",
          key: "patient_id",
        },
      },
    },
    {
      sequelize,
      tableName: "medical_records",
      timestamps: true,
      indexes: [
        {
          name: "PRIMARY",
          unique: true,
          using: "BTREE",
          fields: [{ name: "id" }],
        },
        {
          name: "patient_id_idx",
          using: "BTREE",
          fields: [{ name: "patient_id" }],
        },
      ],
    }
  );
};
