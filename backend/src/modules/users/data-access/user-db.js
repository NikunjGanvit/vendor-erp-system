'use strict';

module.exports = function ({ sequelize }) {
  return {
    findByEmail,
    findByPhone,
    findByEmployeeId,
    createUser,
  };

  async function findByEmail({ email, logger }) {
    try {
      const sql = `
        SELECT id, fullname, email, phone_number, is_active, role, unit, company_id, employee_type, employee_id, designation
        FROM public.user_master
        WHERE email = $1 AND deleted_at IS NULL
        LIMIT 1
      `;
      const result = await sequelize.query(sql, {
        bind: [email],
        type: sequelize.QueryTypes.SELECT,
      });
      return result[0] || null;
    } catch (err) {
      logger?.error(err);
      throw err;
    }
  }

  async function findByPhone({ phone_number, logger }) {
    try {
      const sql = `
        SELECT id, fullname, email, phone_number, is_active, role, unit, company_id, employee_type, employee_id, designation
        FROM public.user_master
        WHERE phone_number = $1 AND deleted_at IS NULL
        LIMIT 1
      `;
      const result = await sequelize.query(sql, {
        bind: [phone_number],
        type: sequelize.QueryTypes.SELECT,
      });
      return result[0] || null;
    } catch (err) {
      logger?.error(err);
      throw err;
    }
  }

  async function findByEmployeeId({ employee_id, logger }) {
    try {
      const sql = `
        SELECT id, fullname, email, phone_number, is_active, role, unit, company_id, employee_type, employee_id, designation
        FROM public.user_master
        WHERE employee_id = $1 AND deleted_at IS NULL
        LIMIT 1
      `;
      const result = await sequelize.query(sql, {
        bind: [employee_id],
        type: sequelize.QueryTypes.SELECT,
      });
      return result[0] || null;
    } catch (err) {
      logger?.error(err);
      throw err;
    }
  }

  async function createUser({ userData, transaction, logger }) {
    try {
      const sql = `
        INSERT INTO public.user_master (
          fullname,
          email,
          password,
          phone_number,
          is_active,
          meta_data,
          is_employee,
          role,
          unit,
          company_id,
          employee_type,
          employee_id,
          designation,
          created_by
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
        RETURNING
          id,
          fullname,
          email,
          phone_number,
          is_active,
          meta_data,
          is_employee,
          role,
          unit,
          company_id,
          employee_type,
          employee_id,
          designation,
          created_at
      `;
      const bindParams = [
        userData.fullname,
        userData.email || null,
        userData.password || null,
        userData.phone_number || null,
        userData.is_active ?? false,
        userData.meta_data ? JSON.stringify(userData.meta_data) : '{}',
        userData.is_employee ?? false,
        userData.role || 'USER',
        userData.unit || null,
        userData.company_id || null,
        userData.employee_type || null,
        userData.employee_id || null,
        userData.designation || null,
        userData.created_by || null,
      ];

      const [row] = await sequelize.query(sql, {
        bind: bindParams,
        transaction,
        type: sequelize.QueryTypes.SELECT,
      });

      return row;
    } catch (err) {
      logger?.error(err);
      throw err;
    }
  }
};
