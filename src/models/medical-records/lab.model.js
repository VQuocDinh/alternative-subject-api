import { DataTypes } from 'sequelize';

export const Lab = (sequelize) => {
  const attributes = {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    lab_name: DataTypes.STRING,
    location: DataTypes.STRING,
    contact_number: DataTypes.STRING,
    available_test: DataTypes.TEXT,
  };

  const options = {
    tableName: 'lab',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  };

  return sequelize.define('Lab', attributes, options);
};
