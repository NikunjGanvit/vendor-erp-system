'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('rfq_vendor_quotations', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT
      },
      rfq_details_id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: { model: 'rfq_details', key: 'id' },
        onDelete: 'CASCADE'
      },
      vendor_id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: { model: 'vendor_master', key: 'id' },
        onDelete: 'RESTRICT'
      },
      price_per_unit: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: false
      },
      quantity: {
        type: Sequelize.DECIMAL(12, 3),
        allowNull: false
      },
      total_amount: {
        type: Sequelize.DECIMAL(15, 2),
        // Note: Generated columns are supported in newer Postgres + Sequelize
      },
      delivery_days: {
        type: Sequelize.INTEGER
      },
      notes: {
        type: Sequelize.TEXT
      },
      status: {
        type: Sequelize.STRING(30),
        defaultValue: 'SUBMITTED',
        validate: {
          isIn: [['SUBMITTED', 'SELECTED', 'REJECTED', 'ACCEPTED']]
        }
      },
      attachment_url: {
        type: Sequelize.TEXT
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    await queryInterface.addIndex('rfq_vendor_quotations', ['rfq_details_id']);
    await queryInterface.addIndex('rfq_vendor_quotations', ['vendor_id']);
    await queryInterface.addIndex('rfq_vendor_quotations', ['status']);
  },

  async down(queryInterface) {
    await queryInterface.dropTable('rfq_vendor_quotations');
  }
};