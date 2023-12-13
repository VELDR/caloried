'use strict';

/** @type {import('sequelize-cli').Migration} */
const { hashPassword } = require('../utils/bcrypt');

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'Admins',
      [
        {
          username: 'admin',
          email: 'admin@example.com',
          password: hashPassword('adminpassword'),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Admins', null, {});
  },
};
