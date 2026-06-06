'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('rfq_details', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT
      },
      rfq_master_id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: { model: 'rfq_master', key: 'id' },
        onDelete: 'CASCADE'
      },
      item_description: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      quantity: {
        type: Sequelize.DECIMAL(12, 3),
        allowNull: false
      },
      unit: {
        type: Sequelize.STRING(20),
        defaultValue: 'NOS'
      },
      estimated_price: {
        type: Sequelize.DECIMAL(15, 2)
      },
      category: {
        type: Sequelize.STRING(100)
      },
      specifications: {
        type: Sequelize.TEXT
      },
      attachment_url: {
        type: Sequelize.TEXT
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    await queryInterface.addIndex('rfq_details', ['rfq_master_id']);
  },

  async down(queryInterface) {
    await queryInterface.dropTable('rfq_details');
  }
};