module.exports = function(sequelize, DataTypes) {
  const Department = sequelize.define('departments', {
    department_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING(45),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'departments',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "department_id" },
        ]
      },
    ]
  });
  Department.associate = function (models) {
    Department.hasMany(models.patient_records, { foreignKey: "department_id" });
    Department.hasMany(models.staff, { foreignKey: "department_id" });
    Department.hasMany(models.appointments, { foreignKey: "department_id" });
  };
  return Department;
};
