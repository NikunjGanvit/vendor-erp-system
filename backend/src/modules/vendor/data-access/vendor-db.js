'use strict';

module.exports = function ({ sequelize, UnknownError }) {
  return {
    findByVendorCode,
    findByGstin,
    createVendor,
    getVendors,
    getVendorById,
    updateVendorById,
    deleteVendorById,
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

  async function findByVendorCode({ vendor_code, logger }) {
    try {
      const sql = `
        SELECT * FROM public.vendor_master
        WHERE vendor_code = $1
        LIMIT 1
      `;
      const [row] = await sequelize.query(sql, {
        bind: [vendor_code],
        type: sequelize.QueryTypes.SELECT,
      });
      return row || null;
    } catch (err) {
      logger?.error(err);
      throw err;
    }
  }

  async function findByGstin({ gstin, logger }) {
    try {
      const sql = `
        SELECT * FROM public.vendor_master
        WHERE gstin = $1
        LIMIT 1
      `;
      const [row] = await sequelize.query(sql, {
        bind: [gstin],
        type: sequelize.QueryTypes.SELECT,
      });
      return row || null;
    } catch (err) {
      logger?.error(err);
      throw err;
    }
  }

  async function createVendor({ vendorData, transaction, logger }) {
    try {
      const sql = `
        INSERT INTO public.vendor_master (
          vendor_code,
          name,
          gstin,
          email,
          phone,
          address,
          city,
          state,
          pincode,
          status,
          rating,
          payment_terms,
          created_by
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
        RETURNING id, vendor_code, name, gstin, email, phone, address, city, state,
                  pincode, status, rating, payment_terms, created_by, updated_by,
                  created_at, updated_at
      `;

      const bindParams = [
        vendorData.vendor_code,
        vendorData.name,
        vendorData.gstin || null,
        vendorData.email,
        vendorData.phone || null,
        vendorData.address || null,
        vendorData.city || null,
        vendorData.state || null,
        vendorData.pincode || null,
        vendorData.status || 'ACTIVE',
        vendorData.rating ?? 0.0,
        vendorData.payment_terms || null,
        vendorData.created_by || null,
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

  async function getVendors({ filter, sort, pagination, logger }) {
    try {
      const normalizedFilter = normalizeFilter(filter);
      const normalizedSort = normalizeSort(sort);
      const whereClause = normalizedFilter.clause.trim();
      const orderClause = normalizedSort.clause.trim();
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

      const bindParams = [...normalizedFilter.params, ...normalizedSort.params];
      const countSql = `SELECT COUNT(*) AS total FROM public.vendor_master ${whereSql}`;
      const totalResult = await sequelize.query(countSql, {
        bind: bindParams,
        type: sequelize.QueryTypes.SELECT,
      });
      const total = parseInt(totalResult[0]?.total || 0, 10);

      const limit = pagination?.limit ?? 20;
      const offset = pagination?.offset ?? 0;
      const sql = `
        SELECT id, vendor_code, name, gstin, email, phone, address, city, state,
               pincode, status, rating, payment_terms, created_by, updated_by,
               created_at, updated_at
        FROM public.vendor_master
        ${whereSql}
        ${orderSql}
        LIMIT $${bindParams.length + 1}
        OFFSET $${bindParams.length + 2}
      `;

      const vendors = await sequelize.query(sql, {
        bind: [...bindParams, limit, offset],
        type: sequelize.QueryTypes.SELECT,
      });

      return { vendors, total };
    } catch (err) {
      logger?.error(err);
      throw err;
    }
  }

  async function getVendorById({ id, logger }) {
    try {
      const sql = `
        SELECT id, vendor_code, name, gstin, email, phone, address, city, state,
               pincode, status, rating, payment_terms, created_by, updated_by,
               created_at, updated_at
        FROM public.vendor_master
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

  async function updateVendorById({ id, vendorData, updatedBy, transaction, logger }) {
    try {
      const fields = [];
      const bindParams = [];

      const appendField = (column, value) => {
        bindParams.push(value);
        fields.push(`${column} = $${bindParams.length}`);
      };

      if (vendorData.vendor_code !== undefined) {
        appendField('vendor_code', vendorData.vendor_code);
      }
      if (vendorData.name !== undefined) {
        appendField('name', vendorData.name);
      }
      if (vendorData.gstin !== undefined) {
        appendField('gstin', vendorData.gstin || null);
      }
      if (vendorData.email !== undefined) {
        appendField('email', vendorData.email);
      }
      if (vendorData.phone !== undefined) {
        appendField('phone', vendorData.phone || null);
      }
      if (vendorData.address !== undefined) {
        appendField('address', vendorData.address || null);
      }
      if (vendorData.city !== undefined) {
        appendField('city', vendorData.city || null);
      }
      if (vendorData.state !== undefined) {
        appendField('state', vendorData.state || null);
      }
      if (vendorData.pincode !== undefined) {
        appendField('pincode', vendorData.pincode || null);
      }
      if (vendorData.status !== undefined) {
        appendField('status', vendorData.status);
      }
      if (vendorData.rating !== undefined) {
        appendField('rating', vendorData.rating);
      }
      if (vendorData.payment_terms !== undefined) {
        appendField('payment_terms', vendorData.payment_terms || null);
      }

      if (updatedBy !== undefined) {
        appendField('updated_by', updatedBy);
      }

      if (fields.length === 0) {
        return getVendorById({ id, logger });
      }

      const sql = `
        UPDATE public.vendor_master
        SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP
        WHERE id = $${bindParams.length + 1}
        RETURNING id, vendor_code, name, gstin, email, phone, address, city, state,
                  pincode, status, rating, payment_terms, created_by, updated_by,
                  created_at, updated_at
      `;
      bindParams.push(id);

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

  async function deleteVendorById({ id, transaction, logger }) {
    try {
      const sql = `
        DELETE FROM public.vendor_master
        WHERE id = $1
        RETURNING id
      `;
      const [row] = await sequelize.query(sql, {
        bind: [id],
        transaction,
        type: sequelize.QueryTypes.SELECT,
      });
      return row || null;
    } catch (err) {
      logger?.error(err);
      throw err;
    }
  }
};
