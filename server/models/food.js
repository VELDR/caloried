'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Food extends Model {
    static associate(models) {
      Food.hasMany(models.FoodLog, {
        as: 'foodLogs',
        foreignKey: 'foodId',
        onDelete: 'CASCADE',
      });
    }
  }
  Food.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      servingSize: DataTypes.INTEGER,
      servingUnit: DataTypes.STRING,
      image: DataTypes.STRING,
      calories: DataTypes.FLOAT,
      fat: DataTypes.FLOAT,
      carbs: DataTypes.FLOAT,
      protein: DataTypes.FLOAT,
    },
    {
      sequelize,
      modelName: 'Food',
    }
  );
  return Food;
};
