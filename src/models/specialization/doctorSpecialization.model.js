import { DataTypes } from 'sequelize';

module.exports = (sequelize) => {
  const DoctorSpecialization = sequelize.define(
    'DoctorSpecialization',
    {
      doctor_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      specialization_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      tableName: 'doctor_specialization',
      timestamps: true,
      underscored: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );

  return DoctorSpecialization;
};
