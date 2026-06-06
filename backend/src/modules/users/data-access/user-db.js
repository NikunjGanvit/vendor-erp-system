'use strict';

module.exports = function ({ sequelize }) {
  return {
    findByEmail,
    findByPhone,
    findByEmployeeId,
    findForAuth,
    createUser,
    findById,
    updateUser,
    deleteUser,
    listUsers,
  };

  async function findByEmail({ email, logger }) {
    try {
      const sql = `
        SELECT u.id, u.fullname, u.email, u.phone_number, u.is_active, u.role_id, r.role AS role, u.unit, u.company_id, u.employee_type, u.employee_id, u.designation
        FROM public.user_master u
        LEFT JOIN public.roles r ON u.role_id = r.id
        WHERE u.email = $1 AND u.deleted_at IS NULL
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

  async function findForAuth({ email, logger }) {
    try {
      const sql = `
        SELECT u.id, u.fullname, u.email, u.password, u.phone_number, u.is_active, u.role_id, r.role AS role, u.unit, u.company_id, u.employee_type, u.employee_id, u.designation
        FROM public.user_master u
        LEFT JOIN public.roles r ON u.role_id = r.id
        WHERE u.email = $1 AND u.deleted_at IS NULL
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
        SELECT u.id, u.fullname, u.email, u.phone_number, u.is_active, u.role_id, r.role AS role, u.unit, u.company_id, u.employee_type, u.employee_id, u.designation
        FROM public.user_master u
        LEFT JOIN public.roles r ON u.role_id = r.id
        WHERE u.phone_number = $1 AND u.deleted_at IS NULL
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
        SELECT u.id, u.fullname, u.email, u.phone_number, u.is_active, u.role_id, r.role AS role, u.unit, u.company_id, u.employee_type, u.employee_id, u.designation
        FROM public.user_master u
        LEFT JOIN public.roles r ON u.role_id = r.id
        WHERE u.employee_id = $1 AND u.deleted_at IS NULL
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
          role_id,
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
          role_id,
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
        userData.role_id || null,
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

  async function findById({ id, logger }) {
    try {
      const sql = `
        SELECT u.id, u.fullname, u.email, u.phone_number, u.is_active, u.role_id, r.role AS role, u.unit, u.company_id, u.employee_type, u.employee_id, u.designation, u.created_at
        FROM public.user_master u
        LEFT JOIN public.roles r ON u.role_id = r.id
        WHERE u.id = $1 AND u.deleted_at IS NULL
        LIMIT 1
      `;
      const result = await sequelize.query(sql, {
        bind: [id],
        type: sequelize.QueryTypes.SELECT,
      });
      return result[0] || null;
    } catch (err) {
      logger?.error(err);
      throw err;
    }
  }

  async function updateUser({ id, userData, transaction, logger }) {
    try {
      const allowedFields = [
        'fullname',
        'email',
        'password',
        'phone_number',
        'is_active',
        'meta_data',
        'is_employee',
        'role_id',
        'unit',
        'company_id',
        'employee_type',
        'employee_id',
        'designation',
        'modified_by',
      ];

      const updates = [];
      const bindParams = [id];
      let paramIndex = 2;

      for (const field of allowedFields) {
        if (userData[field] !== undefined) {
          updates.push(`${field} = $${paramIndex}`);
          let value = userData[field];
          if (field === 'meta_data' && value && typeof value === 'object') {
            value = JSON.stringify(value);
          }
          bindParams.push(value);
          paramIndex++;
        }
      }

      if (updates.length === 0) {
        return findById({ id, logger });
      }

      const sql = `
        UPDATE public.user_master
        SET ${updates.join(', ')}, modified_at = NOW()
        WHERE id = $1 AND deleted_at IS NULL
        RETURNING
          id,
          fullname,
          email,
          phone_number,
          is_active,
          meta_data,
          is_employee,
          role_id,
          unit,
          company_id,
          employee_type,
          employee_id,
          designation,
          created_at,
          modified_at
      `;

      const [row] = await sequelize.query(sql, {
        bind: bindParams,
        transaction,
        type: sequelize.QueryTypes.SELECT,
      });

      return row || null;
    } catch (err) {
      logger?.error(err);
      throw err;
    }
  }

  async function deleteUser({ id, transaction, logger }) {
    try {
      const sql = `
        UPDATE public.user_master
        SET deleted_at = NOW()
        WHERE id = $1 AND deleted_at IS NULL
        RETURNING id
      `;
      const result = await sequelize.query(sql, {
        bind: [id],
        transaction,
        type: sequelize.QueryTypes.SELECT,
      });
      return result[0] || null;
    } catch (err) {
      logger?.error(err);
      throw err;
    }
  }

  async function listUsers({ filters, sort, globalSearch, page = 1, limit = 10, logger }) {
    try {
      const { buildQueryFromFilters, buildMultiSort, validateFiltersAndSorts } = require('eva-utilities/utils/filter-builder-v2');

      const validated = validateFiltersAndSorts(filters, sort);
      
      const userMasterFields = [
        'id', 'fullname', 'email', 'phone_number', 'is_active',
        'meta_data', 'is_employee', 'role_id', 'unit', 'company_id',
        'employee_type', 'employee_id', 'designation', 'created_at', 'modified_at', 'deleted_at'
      ];

      const mappedFilters = (validated.filters || []).map(f => {
        if (userMasterFields.includes(f.field)) {
          return { ...f, field: `u.${f.field}` };
        }
        return f;
      });

      const mappedSort = (validated.sort || []).map(s => {
        if (userMasterFields.includes(s.colId)) {
          return { ...s, colId: `u.${s.colId}` };
        }
        return s;
      });

      let paramIndex = 1;
      const bindParams = [];
      const whereClauses = ['u.deleted_at IS NULL'];

      if (mappedFilters.length > 0) {
        const fieldFilter = buildQueryFromFilters(mappedFilters, paramIndex);
        if (fieldFilter.query && fieldFilter.query.trim()) {
          whereClauses.push(`(${fieldFilter.query.trim()})`);
          bindParams.push(...fieldFilter.params);
          paramIndex += fieldFilter.params.length;
        }
      }

      if (globalSearch) {
        const globalSearchFilters = [
          { field: 'u.fullname', operator: 'contains', value: globalSearch },
          { field: 'u.email', operator: 'contains', value: globalSearch },
          { field: 'u.phone_number', operator: 'contains', value: globalSearch },
          { field: 'u.employee_id', operator: 'contains', value: globalSearch },
          { field: 'u.designation', operator: 'contains', value: globalSearch }
        ];
        const globalSearchQuery = buildQueryFromFilters(globalSearchFilters, paramIndex, { useOrConditions: true });
        if (globalSearchQuery.query && globalSearchQuery.query.trim()) {
          whereClauses.push(`(${globalSearchQuery.query.trim()})`);
          bindParams.push(...globalSearchQuery.params);
          paramIndex += globalSearchQuery.params.length;
        }
      }

      const whereSql = whereClauses.join(' AND ');
      const sortSql = buildMultiSort(mappedSort);

      const offset = (page - 1) * limit;
      const countSql = `
        SELECT COUNT(*)::integer as count
        FROM public.user_master u
        LEFT JOIN public.roles r ON u.role_id = r.id
        WHERE ${whereSql}
      `;

      const [countResult] = await sequelize.query(countSql, {
        bind: bindParams,
        type: sequelize.QueryTypes.SELECT,
      });
      const total = countResult?.count || 0;

      const sql = `
        SELECT u.id, u.fullname, u.email, u.phone_number, u.is_active, u.role_id, r.role AS role, u.unit, u.company_id, u.employee_type, u.employee_id, u.designation, u.created_at, u.modified_at
        FROM public.user_master u
        LEFT JOIN public.roles r ON u.role_id = r.id
        WHERE ${whereSql}
        ${sortSql || 'ORDER BY u.created_at DESC'}
        LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
      `;

      const queryBindParams = [...bindParams, limit, offset];
      const rows = await sequelize.query(sql, {
        bind: queryBindParams,
        type: sequelize.QueryTypes.SELECT,
      });

      return {
        rows,
        total,
      };
    } catch (err) {
      logger?.error(err);
      throw err;
    }
  }
};
