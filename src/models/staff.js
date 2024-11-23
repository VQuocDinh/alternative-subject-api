module.exports = function (sequelize, DataTypes) {
  const Staff = sequelize.define(
    "staff",
    {
      staff_id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      email: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: "email",
      },
      phone_number: {
        type: DataTypes.STRING(15),
        allowNull: true,
      },
      full_name: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      gender: {
        type: DataTypes.STRING(10),
        allowNull: true,
      },
      date_of_birth: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      address: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      position: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      date_joined: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      avatar: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      status: {
        type: DataTypes.TINYINT,
        allowNull: true,
        defaultValue: 1,
      },
      department_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "departments",
          key: "department_id",
        },
      },
      password: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      role_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "roles",
          key: "id",
        },
      },
    },
    {
      sequelize,
      tableName: "staff",
      timestamps: false,
      indexes: [
        {
          name: "PRIMARY",
          unique: true,
          using: "BTREE",
          fields: [{ name: "staff_id" }],
        },
        {
          name: "email",
          unique: true,
          using: "BTREE",
          fields: [{ name: "email" }],
        },
        {
          name: "fk_department_idx",
          using: "BTREE",
          fields: [{ name: "department_id" }, { name: "staff_id" }],
        },
        {
          name: "fk_role_idx",
          using: "BTREE",
          fields: [{ name: "role_id" }],
        },
      ],
    }
  );
  Staff.associate = function (models) {
    Staff.belongsTo(models.departments, { foreignKey: "department_id" });
    Staff.hasMany(models.vital_signs, { foreignKey: "measured_by" });
    Staff.hasMany(models.appointments, { foreignKey: "staff_id" });
  };
  return Staff;
};
