'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'WeightEntries',
      [
        {
          weight: 90,
          dateRecorded: new Date(),
          userId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          weight: 60,
          dateRecorded: new Date(),
          userId: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          weight: 80,
          dateRecorded: new Date(),
          userId: 3,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          weight: 50,
          dateRecorded: new Date(),
          userId: 4,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          weight: 75,
          dateRecorded: new Date(),
          userId: 5,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('WeightEntries', null, {});
  },
};
