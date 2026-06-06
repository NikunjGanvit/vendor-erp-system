'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('vendor_master', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      vendor_code: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true
      },
      name: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      gstin: {
        type: Sequelize.STRING(15),
        unique: true
      },
      email: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      phone: {
        type: Sequelize.STRING(20)
      },
      address: {
        type: Sequelize.TEXT
      },
      city: {
        type: Sequelize.STRING(100)
      },
      state: {
        type: Sequelize.STRING(100)
      },
      pincode: {
        type: Sequelize.STRING(10)
      },
      status: {
        type: Sequelize.STRING(20),
        defaultValue: 'ACTIVE'
      },
      rating: {
        type: Sequelize.DECIMAL(3, 2),
        defaultValue: 0.00
      },
      payment_terms: {
        type: Sequelize.STRING(100)
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
    await queryInterface.addIndex('vendor_master', ['vendor_code'], { name: 'idx_vendor_code' });
    await queryInterface.addIndex('vendor_master', ['status'], { name: 'idx_vendor_status' });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('vendor_master');
  }
};