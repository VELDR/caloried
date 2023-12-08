'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Diary extends Model {
    static associate(models) {
      Diary.belongsTo(models.User, {
        as: 'user',
        foreignKey: 'userId',
        onDelete: 'CASCADE',
      });
      Diary.hasMany(models.Meal, {
        as: 'diary',
        foreignKey: 'diaryId',
        onDelete: 'CASCADE',
      });
    }
  }
  Diary.init(
    {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Diary',
    }
  );
  return Diary;
};
