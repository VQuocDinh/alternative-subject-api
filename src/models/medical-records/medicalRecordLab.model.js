import { DataTypes } from 'sequelize';

export const MedicalRecordLab = (sequelize) => {
  const attributes = {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    medical_record_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'MedicalRecords', key: 'id' },
    },
    lab_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'Lab', key: 'id' },
    },
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

  MedicalRecordLab.associate = (models) => {
    MedicalRecordLab.belongsTo(models.Lab, {
      foreignKey: 'lab_id',
      as: 'lab',
    });

    MedicalRecordLab.belongsTo(models.MedicalRecord, {
      foreignKey: 'medical_record_id',
      as: 'medicalRecord',
    });
  };

  return MedicalRecordLab;
};
