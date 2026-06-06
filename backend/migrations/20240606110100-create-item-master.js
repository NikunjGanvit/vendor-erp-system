'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('item_master', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      item_code: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true
      },
      name: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT
      },
      internal_uom: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      purchase_uom: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      conversion_factor: {
        type: Sequelize.DECIMAL(15, 6),
        allowNull: false,
        defaultValue: 1.000000
      },
      category: {
        type: Sequelize.STRING(100)
      },
      sub_category: {
        type: Sequelize.STRING(100)
      },
      hsn_code: {
        type: Sequelize.STRING(20)
      },
      gst_rate: {
        type: Sequelize.DECIMAL(5, 2),
        defaultValue: 18.00
      },
      base_price: {
        type: Sequelize.DECIMAL(15, 2)
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      is_service: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
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

    // Add indexes
    await queryInterface.addIndex('item_master', ['item_code'], { name: 'idx_item_code' });
    await queryInterface.addIndex('item_master', ['category'], { name: 'idx_item_category' });
    await queryInterface.addIndex('item_master', ['is_active'], { name: 'idx_item_active' });
    await queryInterface.addIndex('item_master', ['internal_uom', 'purchase_uom'], { name: 'idx_item_uom' });

    // Add constraints via raw query (Sequelize doesn't support CHECK directly in older versions)
    await queryInterface.sequelize.query(`
      ALTER TABLE item_master 
      ADD CONSTRAINT chk_conversion_factor CHECK (conversion_factor > 0),
      ADD CONSTRAINT chk_gst_rate CHECK (gst_rate >= 0 AND gst_rate <= 100);
    `);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('item_master');
  }
};