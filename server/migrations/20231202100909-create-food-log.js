'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('FoodLogs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      mealId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'Meals',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      foodId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: 'Food',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      quantity: {
        allowNull: false,
        type: Sequelize.INTEGER,
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
    await queryInterface.dropTable('FoodLogs');
  },
};
