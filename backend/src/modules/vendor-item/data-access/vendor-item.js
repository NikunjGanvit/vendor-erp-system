'use strict';

module.exports = function ({ sequelize, UnknownError }) {
  return {
    findByVendorAndItem,
    findAll,
    findById,
    createVendorItem,
    updateVendorItem,
    deleteVendorItem,
    getVendorItems,
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

  async function findByVendorAndItem({ vendor_id, item_id, logger }) {
    try {
      const sql = `
        SELECT * FROM vendor_item_master 
        WHERE vendor_id = $1 AND item_id = $2 AND deleted_at IS NULL 
        LIMIT 1`;
      const [result] = await sequelize.query(sql, {
        bind: [vendor_id, item_id],
        type: sequelize.QueryTypes.SELECT,
      });
      return result || null;
    } catch (err) {
      logger?.error(err);
      throw err;
    }
  }

  async function findAll({ page = 1, limit = 10, filter, sort, logger }) {
    try {
      const offset = (page - 1) * limit;
      
      // Normalize filter and sort
      const { clause: filterClause, params: filterParams } = normalizeFilter(filter);
      const { clause: sortClause, params: sortParams } = normalizeSort(sort);
      
      const whereClause = filterClause ? `WHERE vim.deleted_at IS NULL AND (${filterClause})` : `WHERE vim.deleted_at IS NULL`;
      const orderBy = sortClause || 'vim.id DESC';

      const sql = `
        SELECT vim.*, vm.name as vendor_name, im.name as item_name 
        FROM vendor_item_master vim
        LEFT JOIN vendor_master vm ON vm.id = vim.vendor_id
        LEFT JOIN item_master im ON im.id = vim.item_id
        ${whereClause}
        ORDER BY ${orderBy}
        LIMIT $${filterParams.length + 1} OFFSET $${filterParams.length + 2}`;

      const bindParams = [...filterParams, limit, offset];

      const result = await sequelize.query(sql, {
        bind: bindParams,
        type: sequelize.QueryTypes.SELECT,
      });

      const countSql = `
        SELECT COUNT(*) FROM vendor_item_master vim
        ${whereClause}`;
      const [countResult] = await sequelize.query(countSql, {
        bind: filterParams,
        type: sequelize.QueryTypes.SELECT,
      });

      return {
        rows: result,
        count: parseInt(countResult.count),
      };
    } catch (err) {
      logger?.error(err);
      throw err;
    }
  }

  async function findById({ id, logger }) {
    try {
      const sql = `
        SELECT vim.*, vm.name as vendor_name, im.name as item_name 
        FROM vendor_item_master vim
        LEFT JOIN vendor_master vm ON vm.id = vim.vendor_id
        LEFT JOIN item_master im ON im.id = vim.item_id
        WHERE vim.id = $1 AND vim.deleted_at IS NULL`;
      const [result] = await sequelize.query(sql, {
        bind: [id],
        type: sequelize.QueryTypes.SELECT,
      });
      return result || null;
    } catch (err) {
      logger?.error(err);
      throw err;
    }
  }

  async function createVendorItem({ vendorItemData, transaction, logger }) {
    try {
      const sql = `
        INSERT INTO vendor_item_master (
          vendor_id, item_id, vendor_item_code, vendor_price, currency,
          min_order_quantity, lead_time_days, discount_percentage,
          is_preferred_vendor, is_active, created_by
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        RETURNING *`;

      const bindParams = [
        vendorItemData.vendor_id,
        vendorItemData.item_id,
        vendorItemData.vendor_item_code,
        vendorItemData.vendor_price,
        vendorItemData.currency,
        vendorItemData.min_order_quantity,
        vendorItemData.lead_time_days,
        vendorItemData.discount_percentage,
        vendorItemData.is_preferred_vendor,
        vendorItemData.is_active,
        vendorItemData.created_by,
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

  async function updateVendorItem({ id, vendorItemData, transaction, logger }) {
    try {
      const sql = `
        UPDATE vendor_item_master 
        SET vendor_item_code = COALESCE($2, vendor_item_code),
            vendor_price = COALESCE($3, vendor_price),
            currency = COALESCE($4, currency),
            min_order_quantity = COALESCE($5, min_order_quantity),
            lead_time_days = COALESCE($6, lead_time_days),
            discount_percentage = COALESCE($7, discount_percentage),
            is_preferred_vendor = COALESCE($8, is_preferred_vendor),
            is_active = COALESCE($9, is_active),
            updated_by = $10,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $1 AND deleted_at IS NULL
        RETURNING *`;

      const bindParams = [
        id,
        vendorItemData.vendor_item_code,
        vendorItemData.vendor_price,
        vendorItemData.currency,
        vendorItemData.min_order_quantity,
        vendorItemData.lead_time_days,
        vendorItemData.discount_percentage,
        vendorItemData.is_preferred_vendor,
        vendorItemData.is_active,
        vendorItemData.updated_by,
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

  async function getVendorItems({ filter, sort, pagination, logger }) {
    try {
      const { limit, offset } = pagination;
      
      // Normalize filter and sort
      const { clause: filterClause, params: filterParams } = normalizeFilter(filter);
      const { clause: sortClause, params: sortParams } = normalizeSort(sort);
      
      const whereClause = filterClause ? `WHERE vim.deleted_at IS NULL AND (${filterClause})` : `WHERE vim.deleted_at IS NULL`;
      const orderBy = sortClause || 'vim.id DESC';

      const sql = `
        SELECT vim.*, vm.name as vendor_name, im.name as item_name 
        FROM vendor_item_master vim
        LEFT JOIN vendor_master vm ON vm.id = vim.vendor_id
        LEFT JOIN item_master im ON im.id = vim.item_id
        ${whereClause}
        ORDER BY ${orderBy}
        LIMIT $${filterParams.length + 1} OFFSET $${filterParams.length + 2}`;

      const bindParams = [...filterParams, limit, offset];

      const items = await sequelize.query(sql, {
        bind: bindParams,
        type: sequelize.QueryTypes.SELECT,
      });

      const countSql = `
        SELECT COUNT(*) as count FROM vendor_item_master vim
        ${whereClause}`;
      const [countResult] = await sequelize.query(countSql, {
        bind: filterParams,
        type: sequelize.QueryTypes.SELECT,
      });

      return {
        items,
        total: parseInt(countResult.count),
      };
    } catch (err) {
      logger?.error(err);
      throw err;
    }
  }

  async function deleteVendorItem({ id, transaction, logger }) {
    try {
      const sql = `
        UPDATE vendor_item_master 
        SET deleted_at = CURRENT_TIMESTAMP 
        WHERE id = $1 AND deleted_at IS NULL
        RETURNING id`;
      const [row] = await sequelize.query(sql, {
        bind: [id],
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