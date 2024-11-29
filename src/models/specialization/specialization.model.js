import { DataTypes } from 'sequelize';

module.exports = (sequelize) => {
  const attributes = {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    specialization_name: DataTypes.STRING,
  };
  const options = {
    tableName: 'specialization',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  };

  const Specialization = sequelize.define('Specialization', attributes, options);

  // Specialization.associate = (models) => {
  //   Specialization.belongsToMany(models.Doctor, {
  //     through: 'DoctorSpecialization',
  //   });
  // };
};
