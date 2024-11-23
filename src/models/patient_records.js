module.exports = function (sequelize, DataTypes) {
  const PatientRecord = sequelize.define(
    "patient_records",
    {
      patient_records_id: {
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
      department_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "departments",
          key: "department_id",
        },
      },
      bill_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "bill",
          key: "bill_id",
        },
      },
      prescription_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "prescriptions",
          key: "prescription_id",
        },
      },
      symptoms: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      diagnosis: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      status: {
        type: DataTypes.STRING(45),
        allowNull: true,
        defaultValue: "In progress",
      },
      note: {
        type: DataTypes.STRING(255),
        allowNull: true,
        
      },
    },
    {
      sequelize,
      tableName: "patient_records",
      timestamps: true,
      indexes: [
        {
          name: "PRIMARY",
          unique: true,
          using: "BTREE",
          fields: [{ name: "patient_records_id" }],
        },
        {
          name: "fk_patient_id",
          using: "BTREE",
          fields: [{ name: "patient_id" }],
        },
        {
          name: "fk_staff_id_idx",
          using: "BTREE",
          fields: [{ name: "staff_id" }],
        },
        {
          name: "fk_department_id_idx",
          using: "BTREE",
          fields: [{ name: "department_id" }],
        },
        {
          name: "fk_bill_id",
          using: "BTREE",
          fields: [{ name: "bill_id" }],
        },
        {
          name: "fk_prescription_id_idx",
          using: "BTREE",
          fields: [{ name: "prescription_id" }],
        },
        {
          name: "fk_updated_by_idx",
          using: "BTREE",
          fields: [{ name: "updated_by" }],
        },
      ],
    }
  );
  PatientRecord.associate = function (models) {
    PatientRecord.belongsTo(models.patients, { foreignKey: "patient_id"});
    PatientRecord.belongsTo(models.staff, { foreignKey: "staff_id"});
    PatientRecord.belongsTo(models.departments, { foreignKey: "department_id"});
    PatientRecord.belongsTo(models.bill, { foreignKey: "bill_id"});
    PatientRecord.belongsTo(models.prescriptions, { foreignKey: "prescription_id"});
  };
  return PatientRecord;
};
