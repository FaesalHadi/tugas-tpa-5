'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('categori_kinds', [
      {
        nama: 'Elektronik',
      },
      {
        nama: 'Pakaian Pria',
      },
      {
        nama: 'Pakaian Wanita',
      },
      {
        nama: 'Kecantikan dan Perawatan Kulit',
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('categori_kinds', null, {});
  }
};