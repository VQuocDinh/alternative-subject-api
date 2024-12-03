import { DataTypes } from 'sequelize';

module.exports = (sequelize) => {
  const attributes = {
    result: {
      type: DataTypes.TEXT,
    },
    test_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    test_type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      defaultValue: 'pending',
    },
  };

  const options = {
    tableName: 'medical_record_lab',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  };

  const MedicalRecordLab = sequelize.define('MedicalRecordLab', attributes, options);

  return MedicalRecordLab;
};
