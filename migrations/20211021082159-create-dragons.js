'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("nfts", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      dragonid: {
        type: Sequelize.INTEGER,
      },
      description: {
        type: Sequelize.TEXT,
      },
      name: {
        type: Sequelize.STRING,
      },
      image: {
        type: Sequelize.STRING,
      },
      ankle: {
        type: Sequelize.STRING,
      },
      dragon: {
        type: Sequelize.STRING,
      },
      bracelet: {
        type: Sequelize.STRING,
      },
      eyes: {
        type: Sequelize.STRING,
      },
      head: {
        type: Sequelize.STRING,
      },
      horns: {
        type: Sequelize.STRING,
      },
      necklace: {
        type: Sequelize.STRING,
      },
      shoulder: {
        type: Sequelize.STRING,
      },
      tail: {
        type: Sequelize.STRING,
      },
      tailends: {
        type: Sequelize.STRING,
      },
      teeth: {
        type: Sequelize.STRING,
      },
      wings: {
        type: Sequelize.STRING,
      },
      background: {
        type: Sequelize.STRING,
      },
      class: {
        type: Sequelize.STRING,
      },
      category: {
        type: Sequelize.STRING,
      },
      ankleDmg: {
        type: Sequelize.INTEGER,
      },
      hp: {
        type: Sequelize.INTEGER,
      },
      braceletDmg: {
        type: Sequelize.INTEGER,
      },
      eyeDmg: {
        type: Sequelize.INTEGER,
      },
      tailDmg: {
        type: Sequelize.INTEGER,
      },
      headDmg: {
        type: Sequelize.INTEGER,
      },
      hornsDmg: {
        type: Sequelize.INTEGER,
      },
      necklaceDmg: {
        type: Sequelize.INTEGER,
      },
      shoulderDmg: {
        type: Sequelize.INTEGER,
      },
      tailDmg: {
        type: Sequelize.INTEGER,
      },
      tailendsDef: {
        type: Sequelize.INTEGER,
      },
      teethDmg: {
        type: Sequelize.INTEGER,
      },
      wingsDef: {
        type: Sequelize.INTEGER,
      },
      specialAttack: {
        type: Sequelize.STRING,
      },
      damage: {
        type: Sequelize.INTEGER,
      },
      defence: {
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
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Dragons');
  }
};