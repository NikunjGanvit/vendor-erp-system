'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Create roles table
    await queryInterface.sequelize.query(`
      CREATE TABLE roles (
        id BIGSERIAL PRIMARY KEY,
        role VARCHAR(50) NOT NULL UNIQUE,
        created_by BIGINT NULL,
        updated_by BIGINT NULL,
        is_active BOOLEAN NOT NULL DEFAULT TRUE,
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMPTZ NULL
      );
    `);

    // Remove role column from user_master
    await queryInterface.sequelize.query(`
      ALTER TABLE user_master
      DROP COLUMN role;
    `);

    // Add role_id column
    await queryInterface.sequelize.query(`
      ALTER TABLE user_master
      ADD COLUMN role_id BIGINT NULL;
    `);

    // Add foreign key
    await queryInterface.sequelize.query(`
      ALTER TABLE user_master
      ADD CONSTRAINT fk_user_master_role_id
      FOREIGN KEY (role_id)
      REFERENCES roles(id)
      ON UPDATE CASCADE
      ON DELETE SET NULL;
    `);
  },

  async down(queryInterface, Sequelize) {
    // Drop foreign key
    await queryInterface.sequelize.query(`
      ALTER TABLE user_master
      DROP CONSTRAINT IF EXISTS fk_user_master_role_id;
    `);

    // Remove role_id column
    await queryInterface.sequelize.query(`
      ALTER TABLE user_master
      DROP COLUMN IF EXISTS role_id;
    `);

    // Add role column back
    await queryInterface.sequelize.query(`
      ALTER TABLE user_master
      ADD COLUMN role VARCHAR(20) NOT NULL DEFAULT 'USER';
    `);

    // Drop roles table
    await queryInterface.sequelize.query(`
      DROP TABLE IF EXISTS roles;
    `);
  },
};