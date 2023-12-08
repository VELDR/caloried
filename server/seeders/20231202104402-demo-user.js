'use strict';

/** @type {import('sequelize-cli').Migration} */
const { hashPassword } = require('../utils/bcrypt');

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'Users',
      [
        {
          username: 'John Doe',
          email: 'johndoe@example.com',
          password: hashPassword('password123'),
          sex: 'male',
          dob: '2003-05-03',
          height: 170,
          weight: 90,
          goal: 'lose',
          activityLevel: 2,
          bmr: 1641,
          proteinIntake: 123,
          fatIntake: 46,
          carbsIntake: 185,
          isEmailVerified: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {});
  },
};
