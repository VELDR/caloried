'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class WeightEntry extends Model {
    static associate(models) {
      WeightEntry.belongsTo(models.User, {
        as: 'user',
        foreignKey: 'userId',
        onDelete: 'CASCADE',
      });
    }
  }
  WeightEntry.init(
    {
      weight: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      dateRecorded: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'WeightEntry',
    }
  );
  return WeightEntry;
};
