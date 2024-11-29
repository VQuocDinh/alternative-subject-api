import { DataTypes } from 'sequelize';

export const Patient = (sequelize) => {
  const attributes = {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    full_name: DataTypes.STRING,
    dob: DataTypes.STRING,
    phone: DataTypes.STRING,
  };

  const options = {
    tableName: 'patient',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  };

  return sequelize.define('patient', attributes, options);
};
