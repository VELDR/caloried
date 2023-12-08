'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Meal extends Model {
    static associate(models) {
      Meal.belongsTo(models.Diary, {
        as: 'diary',
        foreignKey: 'diaryId',
        onDelete: 'CASCADE',
      });
      Meal.hasMany(models.FoodLog, {
        as: 'foodLogs',
        foreignKey: 'mealId',
        onDelete: 'CASCADE',
      });
    }
  }
  Meal.init(
    {
      diaryId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      mealType: {
        type: DataTypes.ENUM,
        values: ['Breakfast', 'Lunch', 'Dinner', 'Snack'],
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Meal',
      indexes: [
        {
          unique: true,
          fields: ['date', 'mealType', 'diaryId'],
        },
      ],
    }
  );
  return Meal;
};
