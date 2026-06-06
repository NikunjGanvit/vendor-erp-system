'use strict';

const { buildQueryFromFilters, buildMultiSort, validateFiltersAndSorts } = require('eva-utilities/utils/filter-builder-v2');

module.exports = function ({ sequelize, UnknownError }) {
  return {
    findByItemCode,
    createItem,
    getItems,
    getItemById,
    updateItemById,
    deleteItemById,
  };

  function normalizeFilter(filter) {
    if (!filter) {
      return { clause: '', params: [] };
    }

    if (typeof filter === 'string') {
      return { clause: filter, params: [] };
    }

    if (Array.isArray(filter)) {
      return {
        clause: filter[0] || '',
        params: filter.slice(1),
      };
    }

    const clause = filter.sql || filter.query || filter.where || '';
    const params = filter.params || filter.values || filter.bind || [];

    const normalizedParams = Array.isArray(params)
      ? params
      : typeof params === 'object' && params !== null
      ? Object.values(params)
      : [];

    return {
      clause: clause || '',
      params: normalizedParams,
    };
  }

  function normalizeSort(sort) {
    if (!sort) {
      return { clause: '', params: [] };
    }

    if (typeof sort === 'string') {
      return { clause: sort, params: [] };
    }

    if (Array.isArray(sort)) {
      return { clause: sort.join(', '), params: [] };
    }

    const clause = sort.sql || sort.query || sort.order || sort.sort || '';
    const params = sort.params || sort.values || sort.bind || [];

    const normalizedParams = Array.isArray(params)
      ? params
      : typeof params === 'object' && params !== null
      ? Object.values(params)
      : [];

    return {
      clause: clause || '',
      params: normalizedParams,
    };
  }

  async function findByItemCode({ item_code, logger }) {
    try {
      const sql = `
        SELECT id, item_code, name, description, internal_uom, purchase_uom, conversion_factor,
               category, sub_category, hsn_code, gst_rate, base_price, is_active, is_service,
               created_by, updated_by, created_at, updated_at
        FROM public.item_master
        WHERE item_code = $1
        LIMIT 1
      `;
      const [row] = await sequelize.query(sql, {
        bind: [item_code],
        type: sequelize.QueryTypes.SELECT,
      });
      return row || null;
    } catch (err) {
      logger?.error(err);
      throw err;
    }
  }

  async function createItem({ itemData, transaction, logger }) {
    try {
      const sql = `
        INSERT INTO public.item_master (
          item_code,
          name,
          description,
          internal_uom,
          purchase_uom,
          conversion_factor,
          category,
          sub_category,
          hsn_code,
          gst_rate,
          base_price,
          is_active,
          is_service,
          created_by
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
        RETURNING id, item_code, name, description, internal_uom, purchase_uom, conversion_factor,
                  category, sub_category, hsn_code, gst_rate, base_price, is_active, is_service,
                  created_by, updated_by, created_at, updated_at
      `;

      const bindParams = [
        itemData.item_code,
        itemData.name,
        itemData.description || null,
        itemData.internal_uom,
        itemData.purchase_uom,
        itemData.conversion_factor ?? 1.0,
        itemData.category || null,
        itemData.sub_category || null,
        itemData.hsn_code || null,
        itemData.gst_rate ?? 18.0,
        itemData.base_price ?? null,
        itemData.is_active ?? true,
        itemData.is_service ?? false,
        itemData.created_by || null,
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

  async function getItems({ filter, filters, sort, pagination, logger }) {
    try {
      const rawFilters = filters ?? filter;
      let effectiveFilters = rawFilters;
      let effectiveSort = sort;

      if (Array.isArray(rawFilters) || Array.isArray(sort)) {
        const validated = validateFiltersAndSorts(Array.isArray(rawFilters) ? rawFilters : [], Array.isArray(sort) ? sort : []);
        effectiveFilters = validated.filters;
        effectiveSort = validated.sort;
      }

      let whereClause = '';
      let filterParams = [];
      if (Array.isArray(effectiveFilters) && effectiveFilters.length > 0 && typeof effectiveFilters[0] === 'object') {
        const built = buildQueryFromFilters(effectiveFilters, 1);
        whereClause = built.query.trim();
        filterParams = built.params;
      } else {
        const normalizedFilter = normalizeFilter(effectiveFilters);
        whereClause = normalizedFilter.clause.trim();
        filterParams = normalizedFilter.params;
      }

      let orderClause = '';
      let sortParams = [];
      if (Array.isArray(effectiveSort) && effectiveSort.length > 0 && typeof effectiveSort[0] === 'object') {
        orderClause = buildMultiSort(effectiveSort).trim().replace(/^order by\s+/i, '');
      } else {
        const normalizedSort = normalizeSort(effectiveSort);
        orderClause = normalizedSort.clause.trim();
        sortParams = normalizedSort.params;
      }

      const whereSql = whereClause
        ? whereClause.toLowerCase().startsWith('where ')
          ? whereClause
          : `WHERE ${whereClause}`
        : '';
      const orderSql = orderClause
        ? orderClause.toLowerCase().startsWith('order by ')
          ? orderClause
          : `ORDER BY ${orderClause}`
        : 'ORDER BY id DESC';

      const bindParams = [...filterParams, ...sortParams];
      const countSql = `SELECT COUNT(*) AS total FROM public.item_master ${whereSql}`;
      const totalResult = await sequelize.query(countSql, {
        bind: bindParams,
        type: sequelize.QueryTypes.SELECT,
      });
      const total = parseInt(totalResult[0]?.total || 0, 10);

      const limit = pagination?.limit ?? 20;
      const offset = pagination?.offset ?? 0;
      const sql = `
        SELECT id, item_code, name, description, internal_uom, purchase_uom, conversion_factor,
               category, sub_category, hsn_code, gst_rate, base_price, is_active, is_service,
               created_by, updated_by, created_at, updated_at
        FROM public.item_master
        ${whereSql}
        ${orderSql}
        LIMIT $${bindParams.length + 1}
        OFFSET $${bindParams.length + 2}
      `;

      const items = await sequelize.query(sql, {
        bind: [...bindParams, limit, offset],
        type: sequelize.QueryTypes.SELECT,
      });

      return { items, total };
    } catch (err) {
      logger?.error(err);
      throw err;
    }
  }

  async function getItemById({ id, logger }) {
    try {
      const sql = `
        SELECT id, item_code, name, description, internal_uom, purchase_uom, conversion_factor,
               category, sub_category, hsn_code, gst_rate, base_price, is_active, is_service,
               created_by, updated_by, created_at, updated_at
        FROM public.item_master
        WHERE id = $1
        LIMIT 1
      `;
      const [row] = await sequelize.query(sql, {
        bind: [id],
        type: sequelize.QueryTypes.SELECT,
      });
      return row || null;
    } catch (err) {
      logger?.error(err);
      throw err;
    }
  }

  async function updateItemById({ id, itemData, updatedBy, transaction, logger }) {
    try {
      const fields = [];
      const bindParams = [];

      const appendField = (column, value) => {
        bindParams.push(value);
        fields.push(`${column} = $${bindParams.length}`);
      };

      if (itemData.item_code !== undefined) {
        appendField('item_code', itemData.item_code);
      }
      if (itemData.name !== undefined) {
        appendField('name', itemData.name);
      }
      if (itemData.description !== undefined) {
        appendField('description', itemData.description || null);
      }
      if (itemData.internal_uom !== undefined) {
        appendField('internal_uom', itemData.internal_uom);
      }
      if (itemData.purchase_uom !== undefined) {
        appendField('purchase_uom', itemData.purchase_uom);
      }
      if (itemData.conversion_factor !== undefined) {
        appendField('conversion_factor', itemData.conversion_factor);
      }
      if (itemData.category !== undefined) {
        appendField('category', itemData.category || null);
      }
      if (itemData.sub_category !== undefined) {
        appendField('sub_category', itemData.sub_category || null);
      }
      if (itemData.hsn_code !== undefined) {
        appendField('hsn_code', itemData.hsn_code || null);
      }
      if (itemData.gst_rate !== undefined) {
        appendField('gst_rate', itemData.gst_rate);
      }
      if (itemData.base_price !== undefined) {
        appendField('base_price', itemData.base_price ?? null);
      }
      if (itemData.is_active !== undefined) {
        appendField('is_active', itemData.is_active);
      }
      if (itemData.is_service !== undefined) {
        appendField('is_service', itemData.is_service);
      }

      appendField('updated_by', updatedBy || null);
      fields.push('updated_at = CURRENT_TIMESTAMP');

      if (fields.length === 0) {
        return getItemById({ id, logger });
      }

      const sql = `
        UPDATE public.item_master
        SET ${fields.join(', ')}
        WHERE id = $${bindParams.length + 1}
        RETURNING id, item_code, name, description, internal_uom, purchase_uom, conversion_factor,
                  category, sub_category, hsn_code, gst_rate, base_price, is_active, is_service,
                  created_by, updated_by, created_at, updated_at
      `;

      const [row] = await sequelize.query(sql, {
        bind: [...bindParams, id],
        transaction,
        type: sequelize.QueryTypes.SELECT,
      });

      return row;
    } catch (err) {
      logger?.error(err);
      throw err;
    }
  }

  async function deleteItemById({ id, deletedBy, logger }) {
    try {
      const sql = `
        DELETE FROM public.item_master
        WHERE id = $1
        RETURNING id, item_code
      `;
      const [row] = await sequelize.query(sql, {
        bind: [id],
        type: sequelize.QueryTypes.SELECT,
      });
      return row || null;
    } catch (err) {
      logger?.error(err);
      throw err;
    }
  }
};
