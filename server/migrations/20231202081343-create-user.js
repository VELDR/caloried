'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      username: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      email: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      password: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      sex: {
        allowNull: false,
        type: Sequelize.ENUM,
        values: ['male', 'female'],
      },
      dob: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      height: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      weight: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      activityLevel: {
        allowNull: false,
        type: Sequelize.INTEGER,
        validate: {
          isIn: [[1, 2, 3, 4, 5]],
        },
      },
      goal: {
        allowNull: false,
        type: Sequelize.ENUM,
        values: ['gain', 'lose', 'maintain'],
      },
      bmr: {
        type: Sequelize.INTEGER,
      },
      proteinIntake: {
        type: Sequelize.INTEGER,
      },
      fatIntake: {
        type: Sequelize.INTEGER,
      },
      carbsIntake: {
        type: Sequelize.INTEGER,
      },
      avatar: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      verificationToken: {
        allowNull: true,
        type: Sequelize.STRING,
      },
      isEmailVerified: {
        defaultValue: false,
        type: Sequelize.BOOLEAN,
      },
      firstLogin: {
        defaultValue: true,
        type: Sequelize.BOOLEAN,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Users');
  },
};
