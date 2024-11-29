import { DataTypes } from 'sequelize';

module.exports = (sequelize) => {
  const DoctorSpecialization = sequelize.define(
    'DoctorSpecialization',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      doctor_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'Doctor', key: 'id' },
      },
      specialization_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'Specialization', key: 'id' },
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
  DoctorSpecialization.associate = (models) => {
    DoctorSpecialization.belongsTo(models.Doctor, {
      foreignKey: 'doctor_id',
      as: 'doctor',
    });
    DoctorSpecialization.belongsTo(models.Specialization, {
      foreignKey: 'specialization_id',
      as: 'specialization',
    });
  };

  return DoctorSpecialization;
};
