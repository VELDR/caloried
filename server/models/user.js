'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasOne(models.Diary, {
        as: 'user',
        foreignKey: 'userId',
        onDelete: 'CASCADE',
      });
      User.hasMany(models.CustomFood, {
        as: 'customFoods',
        foreignKey: 'userId',
        onDelete: 'CASCADE',
      });
    }
  }
  User.init(
    {
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      sex: {
        type: DataTypes.ENUM,
        values: ['male', 'female'],
      },
      dob: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      height: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      weight: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      activityLevel: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          isIn: [[1, 2, 3, 4, 5]],
        },
      },
      goal: {
        type: DataTypes.ENUM,
        values: ['gain', 'lose', 'maintain'],
        allowNull: false,
        defaultValue: 'maintain',
      },
      bmr: DataTypes.INTEGER,
      proteinIntake: DataTypes.INTEGER,
      fatIntake: DataTypes.INTEGER,
      carbsIntake: DataTypes.INTEGER,
      avatar: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      verificationToken: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      isEmailVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      firstLogin: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
    },
    {
      sequelize,
      modelName: 'User',
      hooks: {
        beforeCreate: (user, options) => {
          user.calculateNutrition();
        },
        beforeUpdate: (user, options) => {
          if (
            user.changed('dob') ||
            user.changed('sex') ||
            user.changed('weight') ||
            user.changed('height') ||
            user.changed('activityLevel') ||
            user.changed('goal')
          ) {
            user.calculateNutrition();
          }
        },
        afterCreate: async (user, options) => {
          const diary = await sequelize.models.Diary.create({
            userId: user.id,
          });
          return diary;
        },
      },
    }
  );

  User.prototype.calculateNutrition = function () {
    // Constants for BMR calculation
    const BMR_CONSTANT_MALE = 5;
    const BMR_CONSTANT_FEMALE = -161;
    const BMR_MULTIPLIER_WEIGHT = 10;
    const BMR_MULTIPLIER_HEIGHT = 6.25;
    const BMR_MULTIPLIER_AGE = 5;

    // Activity level multipliers
    const activityLevels = {
      1: 1.2,
      2: 1.375,
      3: 1.55,
      4: 1.725,
      5: 1.9,
    };

    const age = Math.floor(
      (new Date() - new Date(this.dob)) / (365.25 * 24 * 60 * 60 * 1000)
    );

    // Calculate BMR using Mifflin-St Jeor Equation
    let bmr =
      BMR_MULTIPLIER_WEIGHT * this.weight +
      BMR_MULTIPLIER_HEIGHT * this.height -
      BMR_MULTIPLIER_AGE * age +
      (this.sex === 'male' ? BMR_CONSTANT_MALE : BMR_CONSTANT_FEMALE);

    // Adjust BMR based on goal
    switch (this.goal) {
      case 'gain':
        bmr += 500;
        break;
      case 'lose':
        bmr -= 500;
        break;
      case 'maintain':
      default:
        break;
    }

    // Calculate Total Daily Energy Expenditure (TDEE)
    const tdee = bmr * activityLevels[this.activityLevel];

    // Macronutrient daily intake calculation based on the user's goals
    let proteinPercentage, carbsPercentage, fatPercentage;

    switch (this.goal) {
      case 'maintain':
        proteinPercentage = 15;
        carbsPercentage = 50;
        fatPercentage = 35;
        break;
      case 'lose':
        proteinPercentage = 30;
        carbsPercentage = 45;
        fatPercentage = 25;
        break;
      case 'gain':
        proteinPercentage = 20;
        carbsPercentage = 55;
        fatPercentage = 25;
        break;
      default:
        break;
    }

    this.proteinIntake = Math.round(((proteinPercentage / 100) * tdee) / 4); // g per day
    this.carbsIntake = Math.round(((carbsPercentage / 100) * tdee) / 4); // g per day
    this.fatIntake = Math.round(((fatPercentage / 100) * tdee) / 9); // g per day
    // Store the final TDEE value in bmr
    this.bmr = Math.round(tdee);
  };
  return User;
};
