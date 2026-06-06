'use strict';

module.exports = function ({ sequelize }) {
  return {
    createRole,
    findById,
    findByRoleName,
    updateRole,
    deleteRole,
    listRoles,
  };

  async function createRole({ roleData, transaction, logger }) {
    try {
      const sql = `
        INSERT INTO public.roles (
          role,
          is_active,
          created_by
        )
        VALUES ($1, $2, $3)
        RETURNING id, role, is_active, created_by, created_at
      `;
      const bindParams = [
        roleData.role,
        roleData.is_active ?? true,
        roleData.created_by || null,
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
        SELECT id, role, is_active, created_by, updated_by, created_at, updated_at
        FROM public.roles
        WHERE id = $1
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

  async function findByRoleName({ roleName, logger }) {
    try {
      const sql = `
        SELECT id, role, is_active, created_by, updated_by, created_at, updated_at
        FROM public.roles
        WHERE LOWER(role) = LOWER($1)
        LIMIT 1
      `;
      const result = await sequelize.query(sql, {
        bind: [roleName],
        type: sequelize.QueryTypes.SELECT,
      });
      return result[0] || null;
    } catch (err) {
      logger?.error(err);
      throw err;
    }
  }

  async function updateRole({ id, roleData, transaction, logger }) {
    try {
      const allowedFields = ['role', 'is_active', 'updated_by'];
      const updates = [];
      const bindParams = [id];
      let paramIndex = 2;

      for (const field of allowedFields) {
        if (roleData[field] !== undefined) {
          updates.push(`${field} = $${paramIndex}`);
          bindParams.push(roleData[field]);
          paramIndex++;
        }
      }

      if (updates.length === 0) {
        return findById({ id, logger });
      }

      const sql = `
        UPDATE public.roles
        SET ${updates.join(', ')}, updated_at = NOW()
        WHERE id = $1
        RETURNING id, role, is_active, created_by, updated_by, created_at, updated_at
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

  async function deleteRole({ id, transaction, logger }) {
    try {
      const sql = `
        DELETE FROM public.roles
        WHERE id = $1
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

  async function listRoles({ filters, sort, globalSearch, page = 1, limit = 10, logger }) {
    try {
      const { buildQueryFromFilters, buildMultiSort, validateFiltersAndSorts } = require('eva-utilities/utils/filter-builder-v2');

      const validated = validateFiltersAndSorts(filters, sort);
      
      let paramIndex = 1;
      const bindParams = [];
      const whereClauses = [];

      if (validated.filters && validated.filters.length > 0) {
        const fieldFilter = buildQueryFromFilters(validated.filters, paramIndex);
        if (fieldFilter.query && fieldFilter.query.trim()) {
          whereClauses.push(`(${fieldFilter.query.trim()})`);
          bindParams.push(...fieldFilter.params);
          paramIndex += fieldFilter.params.length;
        }
      }

      if (globalSearch) {
        const globalSearchFilters = [
          { field: 'role', operator: 'contains', value: globalSearch }
        ];
        const globalSearchQuery = buildQueryFromFilters(globalSearchFilters, paramIndex, { useOrConditions: true });
        if (globalSearchQuery.query && globalSearchQuery.query.trim()) {
          whereClauses.push(`(${globalSearchQuery.query.trim()})`);
          bindParams.push(...globalSearchQuery.params);
          paramIndex += globalSearchQuery.params.length;
        }
      }

      const whereSql = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';
      const sortSql = buildMultiSort(validated.sort);

      const offset = (page - 1) * limit;
      const countSql = `
        SELECT COUNT(*)::integer as count
        FROM public.roles
        ${whereSql}
      `;

      const [countResult] = await sequelize.query(countSql, {
        bind: bindParams,
        type: sequelize.QueryTypes.SELECT,
      });
      const total = countResult?.count || 0;

      const sql = `
        SELECT id, role, is_active, created_by, updated_by, created_at, updated_at
        FROM public.roles
        ${whereSql}
        ${sortSql || 'ORDER BY created_at DESC'}
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
