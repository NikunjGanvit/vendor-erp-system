'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // PO Header
    await queryInterface.createTable('po_header', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT
      },
      po_number: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true
      },
      rfq_master_id: {
        type: Sequelize.BIGINT,
        references: { model: 'rfq_master', key: 'id' },
        onDelete: 'SET NULL'
      },
      vendor_id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: { model: 'vendor_master', key: 'id' }
      },
      procurement_officer_id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: { model: 'user_master', key: 'id' }
      },
      status: {
        type: Sequelize.STRING(30),
        defaultValue: 'DRAFT',
        validate: {
          isIn: [['DRAFT','APPROVED','PARTIALLY_RECEIVED','RECEIVED','CANCELLED','CLOSED']]
        }
      },
      po_date: {
        type: Sequelize.DATEONLY,
        defaultValue: Sequelize.literal('CURRENT_DATE')
      },
      delivery_date: {
        type: Sequelize.DATEONLY
      },
      total_amount: {
        type: Sequelize.DECIMAL(15, 2),
        defaultValue: 0,
        allowNull: false
      },
      tax_amount: {
        type: Sequelize.DECIMAL(15, 2),
        defaultValue: 0
      },
      grand_total: {
        type: Sequelize.DECIMAL(15, 2)
      },
      currency: {
        type: Sequelize.STRING(3),
        defaultValue: 'INR'
      },
      notes: {
        type: Sequelize.TEXT
      },
      approval_status: {
        type: Sequelize.STRING(20),
        defaultValue: 'PENDING'
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

    // PO Details
    await queryInterface.createTable('po_details', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT
      },
      po_header_id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: { model: 'po_header', key: 'id' },
        onDelete: 'CASCADE'
      },
      rfq_details_id: {
        type: Sequelize.BIGINT,
        references: { model: 'rfq_details', key: 'id' },
        onDelete: 'SET NULL'
      },
      rfq_vendor_quotation_id: {
        type: Sequelize.BIGINT,
        references: { model: 'rfq_vendor_quotations', key: 'id' },
        onDelete: 'SET NULL'
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
        type: Sequelize.STRING(20)
      },
      unit_price: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: false
      },
      total_price: {
        type: Sequelize.DECIMAL(15, 2)
      },
      delivery_date: {
        type: Sequelize.DATEONLY
      },
      status: {
        type: Sequelize.STRING(30),
        defaultValue: 'OPEN'
      }
    });

    await queryInterface.addIndex('po_header', ['status']);
    await queryInterface.addIndex('po_header', ['vendor_id']);
    await queryInterface.addIndex('po_details', ['po_header_id']);
    await queryInterface.addIndex('po_details', ['rfq_vendor_quotation_id']);
  },

  async down(queryInterface) {
    await queryInterface.dropTable('po_details');
    await queryInterface.dropTable('po_header');
  }
};