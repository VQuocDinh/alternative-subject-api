import { DataTypes } from 'sequelize';
import db from '..';

module.exports = (sequelize) => {
  const DoctorSpecialization = sequelize.define(
    'DoctorSpecialization',
    {
      doctor_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: db.Doctor,
          key: 'id',
        },
      },
      specialization_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: db.Specialization,
          key: 'id',
        },
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
