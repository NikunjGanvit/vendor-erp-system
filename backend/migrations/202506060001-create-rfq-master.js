'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('rfq_master', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT
      },
      rfq_number: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true
      },
      title: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      procurement_officer_id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: { model: 'user_master', key: 'id' },
        onDelete: 'RESTRICT'
      },
      status: {
        type: Sequelize.STRING(30),
        defaultValue: 'DRAFT',
        validate: {
          isIn: [['DRAFT', 'OPEN', 'CLOSED', 'CANCELLED']]
        }
      },
      deadline: {
        type: Sequelize.DATEONLY,
        allowNull: false
      },
      notes: {
        type: Sequelize.TEXT
      },
      total_estimated_amount: {
        type: Sequelize.DECIMAL(15, 2),
        defaultValue: 0
      },
      currency: {
        type: Sequelize.STRING(3),
        defaultValue: 'INR'
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
      },
      created_by: {
        type: Sequelize.BIGINT
      },
      updated_by: {
        type: Sequelize.BIGINT
      }
    });

    await queryInterface.addIndex('rfq_master', ['status']);
    await queryInterface.addIndex('rfq_master', ['deadline']);
  },

  async down(queryInterface) {
    await queryInterface.dropTable('rfq_master');
  }
};