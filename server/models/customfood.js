'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CustomFood extends Model {
    static associate(models) {
      CustomFood.belongsTo(models.User, {
        as: 'user',
        foreignKey: 'userId',
        onDelete: 'CASCADE',
      });
    }
  }
  CustomFood.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      image: DataTypes.STRING,
      servingSize: DataTypes.INTEGER,
      servingUnit: DataTypes.STRING,
      calories: DataTypes.FLOAT,
      fat: DataTypes.FLOAT,
      carbs: DataTypes.FLOAT,
      protein: DataTypes.FLOAT,
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'CustomFood',
    }
  );
  return CustomFood;
};
