const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  const Patient =  sequelize.define('patients', {
    patient_id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    full_name: {
      type: DataTypes.STRING(45),
      allowNull: false
    },
    phone_number: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    cccd: {
      type: DataTypes.STRING(45),
      allowNull: false
    },
    date_of_birth: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },
    avatar: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    gender: {
      type: DataTypes.STRING(45),
      allowNull: true,
      defaultValue: "Male"
    },
    status: {
      type: DataTypes.TINYINT,
      allowNull: true,
      defaultValue: 1
    },
    email: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    address: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    emergency_contact_name: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    emergency_contact_phone: {
      type: DataTypes.STRING(45),
      allowNull: true
    },
    blood_type: {
      type: DataTypes.STRING(45),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'patients',
    timestamps: true,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "patient_id" },
        ]
      },
    ]
  });
  Patient.associate = function(models) {
    Patient.hasMany(models.patient_records, { foreignKey: 'patient_id'});
    Patient.hasMany(models.appointments, { foreignKey: 'patient_id'});
  };
  return Patient
};
