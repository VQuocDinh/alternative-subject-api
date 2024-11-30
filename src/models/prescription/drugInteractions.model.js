const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const DrugInteractions = sequelize.define(
    'DrugInteractions',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
    },
    {
      tableName: 'drug_interactions',
      timestamps: true,
      underscored: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );

  return DrugInteractions;
};

// sửa đi
