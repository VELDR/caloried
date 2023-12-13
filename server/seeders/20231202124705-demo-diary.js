'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'Diaries',
      [
        {
          userId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          userId: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          userId: 3,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          userId: 4,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          userId: 5,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Diaries', null, {});
  },
};
