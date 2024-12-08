import { DataTypes } from 'sequelize';

module.exports = (sequelize) => {
    const Role = sequelize.define(
      'Role',
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        name: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: true,
        },
      },
      {
        tableName: 'roles',
        timestamps: false,
      }
    );
  
    Role.associate = (models) => {
      Role.hasMany(models.User, {
        foreignKey: 'role_id',
        as: 'users',
      });
    };
  
    return Role;
  };
  