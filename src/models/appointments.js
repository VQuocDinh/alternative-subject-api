const Sequelize = require("sequelize");
module.exports = function (sequelize, DataTypes) {
  const Appointments = sequelize.define(
    "appointments",
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
      staff_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "staff",
          key: "staff_id",
        },
      },
      appointment_date: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      appointment_type: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      department_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "departments",
          key: "department_id",
        },
      },
      status: {
        type: DataTypes.STRING(20),
        allowNull: false,
        defaultValue: "scheduled",
      },
      notes: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: "appointments",
      timestamps: true,
      indexes: [
        {
          name: "PRIMARY",
          unique: true,
          using: "BTREE",
          fields: [{ name: "id" }],
        },
        {
          name: "id_patientfk_idx",
          using: "BTREE",
          fields: [{ name: "id_patient" }],
        },
        {
          name: "id_stafffk_idx",
          using: "BTREE",
          fields: [{ name: "id_staff" }],
        },
        {
          name: "id_departmentfk_idx",
          using: "BTREE",
          fields: [{ name: "department_id" }],
        },
      ],
    }
  );

  Appointments.associate = function (models) {
    Appointments.belongsTo(models.staff, { foreignKey: "staff_id" });
    Appointments.belongsTo(models.departments, { foreignKey: "department_id" });
    Appointments.belongsTo(models.patients, { foreignKey: "patient_id" });
  };
  return Appointments;
};
