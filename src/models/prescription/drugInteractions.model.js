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
      medicine_id_1: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'medicine',
          key: 'id'
        }
      },
      medicine_id_2: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'medicine',
          key: 'id'
        }
      },
      severity_level: {
        type: DataTypes.ENUM('MINOR', 'MODERATE', 'MAJOR', 'CONTRAINDICATED'),
        allowNull: false,
        comment: 'Mức độ nghiêm trọng của tương tác thuốc'
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: 'Mô tả chi tiết về tương tác thuốc'
      },
      effects: {
        type: DataTypes.TEXT,
        comment: 'Tác dụng phụ có thể xảy ra'
      },
      recommendations: {
        type: DataTypes.TEXT,
        comment: 'Đề xuất xử lý tương tác thuốc'
      },
      reference: {
        type: DataTypes.STRING,
        comment: 'Nguồn tham khảo thông tin tương tác'
      },
      last_updated: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        comment: 'Thời điểm cập nhật thông tin tương tác gần nhất'
      }
    },
    {
      tableName: 'drug_interactions',
      timestamps: true,
      underscored: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      indexes: [
        {
          unique: true,
          fields: ['medicine_id_1', 'medicine_id_2']
        }
      ]
    }
  );

  return DrugInteractions;
};

