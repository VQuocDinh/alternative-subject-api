import { DataTypes } from 'sequelize';

module.exports = (sequelize) => {
  const HealthcareStaff = sequelize.define(
    'HealthcareStaff',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      first_name: DataTypes.STRING,
      last_name: DataTypes.STRING,
      phone_number: DataTypes.STRING,
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM('active', 'inactive', 'banned'),
        defaultValue: 'active',
      },
      role_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
    },
    {
      tableName: 'healthcare_staff',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );

  return HealthcareStaff;
};
