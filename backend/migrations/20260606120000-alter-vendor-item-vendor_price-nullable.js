'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('vendor_item_master', 'vendor_price', {
      type: Sequelize.DECIMAL(15, 2),
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.sequelize.query(
        'UPDATE vendor_item_master SET vendor_price = 0 WHERE vendor_price IS NULL',
        { transaction }
      );

      await queryInterface.changeColumn(
        'vendor_item_master',
        'vendor_price',
        {
          type: Sequelize.DECIMAL(15, 2),
          allowNull: false,
          defaultValue: 0,
        },
        { transaction }
      );
    });
  },
};
