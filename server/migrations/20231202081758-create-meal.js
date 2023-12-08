'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Meals', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      diaryId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'Diaries',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      date: {
        allowNull: false,
        type: Sequelize.DATEONLY,
      },
      mealType: {
        allowNull: false,
        type: Sequelize.ENUM,
        values: ['Breakfast', 'Lunch', 'Dinner', 'Snack'],
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
    await queryInterface.dropTable('Meals');
  },
};
