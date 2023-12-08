'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class FoodLog extends Model {
    static associate(models) {
      FoodLog.belongsTo(models.Meal, {
        as: 'meal',
        foreignKey: 'mealId',
        onDelete: 'CASCADE',
      });
      FoodLog.belongsTo(models.Food, {
        as: 'food',
        foreignKey: 'foodId',
        onDelete: 'CASCADE',
      });
    }
  }
  FoodLog.init(
    {
      mealId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      foodId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'FoodLog',
    }
  );
  return FoodLog;
};
