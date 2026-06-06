'use strict';

const { buildQueryFromFilters, buildMultiSort } = require('eva-utilities/utils/filter-builder-v2');

module.exports = function ({ sequelize, UnknownError }) {
  return {
    createPO,
    getPOs,
    getPOById,
    updatePOById,
    deletePOById,
    findByPONumber,
    getPOWithDetails,
  };

  function normalizeFilter(filter) {
    if (!filter) {
      return { clause: '', params: [] };
    }

    if (typeof filter === 'string') {
      return { clause: filter, params: [] };
    }

    if (Array.isArray(filter)) {
      if (filter.length > 0 && typeof filter[0] === 'object') {
        const { query, params } = buildQueryFromFilters(filter);
        return { clause: query.trim(), params };
      }

      return {
        clause: filter[0] || '',
        params: filter.slice(1),
      };
    }

    if (filter && typeof filter === 'object') {
      if (Array.isArray(filter.filters)) {
        const { query, params } = buildQueryFromFilters(filter.filters);
        return { clause: query.trim(), params };
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

    return { clause: '', params: [] };
  }

  function normalizeSort(sort, defaultSort = 'po_header.created_at DESC') {
    if (!sort) {
      return { clause: defaultSort, params: [] };
    }

    if (typeof sort === 'string') {
      return { clause: sort, params: [] };
    }

    if (Array.isArray(sort)) {
      if (sort.length > 0 && typeof sort[0] === 'object') {
        const orderBy = buildMultiSort(sort).trim();
        const clause = orderBy.replace(/^order by\s+/i, '');
        return { clause: clause || defaultSort, params: [] };
      }

      return { clause: sort.join(', '), params: [] };
    }

    if (sort && typeof sort === 'object') {
      if (Array.isArray(sort.sort) || Array.isArray(sort.order)) {
        const clause = (sort.sort || sort.order).join(', ');
        return { clause: clause || defaultSort, params: [] };
      }

      const clause = sort.sql || sort.query || sort.order || sort.sort || defaultSort;
      const params = sort.params || sort.values || sort.bind || [];
      const normalizedParams = Array.isArray(params)
        ? params
        : typeof params === 'object' && params !== null
        ? Object.values(params)
        : [];

      return {
        clause: clause || defaultSort,
        params: normalizedParams,
      };
    }

    return { clause: defaultSort, params: [] };
  }

  async function findByPONumber({ po_number, logger }) {
    try {
      const sql = `
        SELECT * FROM public.po_header
        WHERE po_number = $1
        LIMIT 1
      `;
      const [row] = await sequelize.query(sql, {
        bind: [po_number],
        type: sequelize.QueryTypes.SELECT,
      });

      logger?.debug({ po_number, found: !!row }, 'findByPONumber');
      return row;
    } catch (err) {
      logger?.error({ err, po_number }, 'Error in findByPONumber');
      throw new UnknownError('Failed to query database');
    }
  }

  async function createPO({ poData, logger }) {
    const t = await sequelize.transaction();

    try {
      const {
        po_number,
        rfq_master_id,
        vendor_id,
        procurement_officer_id,
        status,
        po_date,
        delivery_date,
        total_amount,
        tax_amount,
        grand_total,
        currency,
        notes,
        approval_status,
        po_details,
      } = poData;

      // Create PO Header
      const insertHeaderSql = `
        INSERT INTO public.po_header (
          po_number, rfq_master_id, procurement_officer_id, 
          status, po_date, delivery_date, total_amount, tax_amount, 
          grand_total, currency, notes, approval_status, created_at, updated_at
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        RETURNING *
      `;

      const [poHeader] = await sequelize.query(insertHeaderSql, {
        bind: [
          po_number,
          rfq_master_id || null,
          procurement_officer_id,
          status || 'DRAFT',
          po_date,
          delivery_date,
          total_amount || 0,
          tax_amount || 0,
          grand_total || 0,
          currency || 'INR',
          notes,
          approval_status || 'PENDING',
        ],
        type: sequelize.QueryTypes.SELECT,
        transaction: t,
      });

      // Create PO Details if provided
      if (Array.isArray(po_details) && po_details.length > 0) {
        for (const detail of po_details) {
          const insertDetailSql = `
            INSERT INTO public.po_details (
              po_header_id, rfq_details_id, item_id, vendor_item_id,
              quantity, unit_price, total_price, unit, tax_rate,
              tax_amount, status, created_at, updated_at
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
          `;

          await sequelize.query(insertDetailSql, {
            bind: [
              poHeader.id,
              detail.rfq_details_id || null,
              detail.item_id,
              detail.vendor_item_id || null,
              detail.quantity,
              detail.unit_price,
              detail.total_price || (detail.quantity * detail.unit_price),
              detail.unit || 'NOS',
              detail.tax_rate || 0,
              detail.tax_amount || 0,
              detail.status || 'PENDING',
            ],
            type: sequelize.QueryTypes.INSERT,
            transaction: t,
          });
        }
      }

      await t.commit();

      logger?.info({ po_id: poHeader.id, po_number }, 'PO created successfully');
      return poHeader;
    } catch (err) {
      await t.rollback();
      logger?.error({ err }, 'Error in createPO');
      throw new UnknownError('Failed to create PO');
    }
  }

  async function getPOs({ limit, offset, filter, sort, logger }) {
    try {
      const { clause: filterClause, params: filterParams } = normalizeFilter(filter);
      const { clause: sortClause, params: sortParams } = normalizeSort(sort);

      // Build separate where/sort clauses for count (no alias) and data (uses alias 'ph')
      let whereCondition = 'WHERE 1=1';
      if (filterClause) {
        whereCondition += ` AND ${filterClause}`;
      }

      const countSql = `SELECT COUNT(*) as total FROM public.po_header ${whereCondition}`;
      const [countResult] = await sequelize.query(countSql, {
        bind: filterParams,
        type: sequelize.QueryTypes.SELECT,
      });

      // Replace any table references to po_header or public.po_header with alias 'ph' for the data query
      const aliasedFilterClause = filterClause
        ? filterClause.replace(/\b(public\.)?po_header\b/g, 'ph')
        : '';
      const aliasedSortClause = sortClause
        ? sortClause.replace(/\b(public\.)?po_header\b/g, 'ph')
        : sortClause;

      let whereConditionForData = 'WHERE 1=1';
      if (aliasedFilterClause) {
        whereConditionForData += ` AND ${aliasedFilterClause}`;
      }

      const dataSql = `
        SELECT 
          ph.*,
          um.fullname as procurement_officer_name
        FROM public.po_header ph
        LEFT JOIN user_master um ON ph.procurement_officer_id = um.id
        ${whereConditionForData}
        ORDER BY ${aliasedSortClause}
        LIMIT $${filterParams.length + 1} OFFSET $${filterParams.length + 2}
      `;

      const rows = await sequelize.query(dataSql, {
        bind: [...filterParams, limit, offset],
        type: sequelize.QueryTypes.SELECT,
      });

      logger?.debug({ count: rows.length, total: countResult.total }, 'getPOs');
      return {
        data: rows,
        total: parseInt(countResult.total, 10),
        limit,
        offset,
      };
    } catch (err) {
      logger?.error({ err }, 'Error in getPOs');
      throw new UnknownError('Failed to fetch POs');
    }
  }

  async function getPOById({ id, logger }) {
    try {
      const sql = `
        SELECT 
          ph.*,
          um.fullname as procurement_officer_name
        FROM public.po_header ph
        LEFT JOIN user_master um ON ph.procurement_officer_id = um.id
        WHERE ph.id = $1
        LIMIT 1
      `;
      const [row] = await sequelize.query(sql, {
        bind: [id],
        type: sequelize.QueryTypes.SELECT,
      });

      logger?.debug({ id, found: !!row }, 'getPOById');
      return row;
    } catch (err) {
      logger?.error({ err, id }, 'Error in getPOById');
      throw new UnknownError('Failed to fetch PO');
    }
  }

  async function getPOWithDetails({ id, logger }) {
    try {
      const headerSql = `
        SELECT 
          ph.*,
          um.fullname as procurement_officer_name
        FROM public.po_header ph
        LEFT JOIN user_master um ON ph.procurement_officer_id = um.id
        WHERE ph.id = $1
        LIMIT 1
      `;
      const [header] = await sequelize.query(headerSql, {
        bind: [id],
        type: sequelize.QueryTypes.SELECT,
      });

      if (!header) {
        return null;
      }

      const detailsSql = `
        SELECT * FROM public.po_details
        WHERE po_header_id = $1
      `;
      const details = await sequelize.query(detailsSql, {
        bind: [id],
        type: sequelize.QueryTypes.SELECT,
      });

      logger?.debug({ id, detailsCount: details.length }, 'getPOWithDetails');
      return {
        ...header,
        po_details: details,
      };
    } catch (err) {
      logger?.error({ err, id }, 'Error in getPOWithDetails');
      throw new UnknownError('Failed to fetch PO with details');
    }
  }

  async function updatePOById({ id, updateData, logger }) {
    try {
      const allowedFields = [
        'status',
        'approval_status',
        'delivery_date',
        'total_amount',
        'tax_amount',
        'grand_total',
        'notes',
      ];

      const updates = [];
      const params = [];
      let paramIndex = 1;

      for (const [key, value] of Object.entries(updateData)) {
        if (allowedFields.includes(key)) {
          updates.push(`${key} = $${paramIndex}`);
          params.push(value);
          paramIndex++;
        }
      }

      if (updates.length === 0) {
        logger?.warn({ id, updateData }, 'No valid fields to update');
        return { message: 'No fields to update' };
      }

      params.push(id);
      const sql = `
        UPDATE public.po_header
        SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP
        WHERE id = $${paramIndex}
        RETURNING *
      `;

      const [updatedRow] = await sequelize.query(sql, {
        bind: params,
        type: sequelize.QueryTypes.SELECT,
      });

      logger?.info({ id, updatedFields: Object.keys(updateData) }, 'PO updated successfully');
      return updatedRow;
    } catch (err) {
      logger?.error({ err, id }, 'Error in updatePOById');
      throw new UnknownError('Failed to update PO');
    }
  }

  async function deletePOById({ id, logger }) {
    const t = await sequelize.transaction();

    try {
      // Delete PO Details first
      const deleteDetailsSql = 'DELETE FROM public.po_details WHERE po_header_id = $1';
      await sequelize.query(deleteDetailsSql, {
        bind: [id],
        type: sequelize.QueryTypes.DELETE,
        transaction: t,
      });

      // Delete PO Header
      const deleteHeaderSql = 'DELETE FROM public.po_header WHERE id = $1 RETURNING *';
      const [deletedRow] = await sequelize.query(deleteHeaderSql, {
        bind: [id],
        type: sequelize.QueryTypes.SELECT,
        transaction: t,
      });

      await t.commit();

      logger?.info({ id, po_number: deletedRow?.po_number }, 'PO deleted successfully');
      return deletedRow;
    } catch (err) {
      await t.rollback();
      logger?.error({ err, id }, 'Error in deletePOById');
      throw new UnknownError('Failed to delete PO');
    }
  }
};
