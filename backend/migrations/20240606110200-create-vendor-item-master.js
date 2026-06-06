'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('vendor_item_master', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      vendor_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      item_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      vendor_item_code: {
        type: Sequelize.STRING(100)
      },
      vendor_price: {
        type: Sequelize.DECIMAL(15, 2),
        allowNull: false
      },
      currency: {
        type: Sequelize.STRING(3),
        defaultValue: 'INR'
      },
      min_order_quantity: {
        type: Sequelize.INTEGER,
        defaultValue: 1
      },
      lead_time_days: {
        type: Sequelize.INTEGER
      },
      discount_percentage: {
        type: Sequelize.DECIMAL(5, 2),
        defaultValue: 0.00
      },
      is_preferred_vendor: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      created_by: {
        type: Sequelize.INTEGER
      },
      updated_by: {
        type: Sequelize.INTEGER
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

    // Add Foreign Keys
    await queryInterface.addConstraint('vendor_item_master', {
      fields: ['vendor_id'],
      type: 'foreign key',
      name: 'fk_vendor_item_vendor',
      references: {
        table: 'vendor_master',
        field: 'id'
      },
      onDelete: 'CASCADE'
    });

    await queryInterface.addConstraint('vendor_item_master', {
      fields: ['item_id'],
      type: 'foreign key',
      name: 'fk_vendor_item_item',
      references: {
        table: 'item_master',
        field: 'id'
      },
      onDelete: 'CASCADE'
    });

    // Unique constraint
    await queryInterface.addConstraint('vendor_item_master', {
      fields: ['vendor_id', 'item_id'],
      type: 'unique',
      name: 'uq_vendor_item'
    });

    // Indexes
    await queryInterface.addIndex('vendor_item_master', ['vendor_id'], { name: 'idx_vendor_item_vendor' });
    await queryInterface.addIndex('vendor_item_master', ['item_id'], { name: 'idx_vendor_item_item' });
    await queryInterface.addIndex('vendor_item_master', ['is_preferred_vendor'], { name: 'idx_vendor_preferred' });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('vendor_item_master');
  }
};