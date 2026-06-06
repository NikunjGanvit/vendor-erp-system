'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      CREATE TABLE public.user_master (
        id BIGSERIAL NOT NULL,
        password VARCHAR(150) NULL,
        fullname VARCHAR(50) NOT NULL,
        email VARCHAR(40) NULL,
        created_by BIGINT NULL,
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NULL,
        modified_at TIMESTAMPTZ NULL,
        modified_by BIGINT NULL,
        phone_number VARCHAR(20) NULL,
        deleted_by BIGINT NULL,
        deleted_at TIMESTAMPTZ NULL,
        is_active BOOLEAN DEFAULT FALSE NOT NULL,
        meta_data JSONB DEFAULT '{}'::jsonb NULL,
        is_employee BOOLEAN DEFAULT FALSE NOT NULL,
        role VARCHAR(20) DEFAULT 'USER' NOT NULL,
        unit CHAR(2) NULL,
        company_id BIGINT NULL,
        employee_type VARCHAR NULL,
        employee_id VARCHAR NULL,
        designation VARCHAR NULL,
        CONSTRAINT user_master_pkey PRIMARY KEY (id)
      );
    `);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      DROP TABLE IF EXISTS public.user_master;
    `);
  }
};