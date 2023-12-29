'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Food', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      servingSize: {
        type: Sequelize.INTEGER,
      },
      servingUnit: {
        type: Sequelize.STRING,
      },
      image: {
        type: Sequelize.STRING,
      },
      calories: {
        type: Sequelize.FLOAT,
      },
      fat: {
        type: Sequelize.FLOAT,
      },
      carbs: {
        type: Sequelize.FLOAT,
      },
      protein: {
        type: Sequelize.FLOAT,
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
    await queryInterface.dropTable('Food');
  },
};
