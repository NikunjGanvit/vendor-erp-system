'use strict';

const { buildQueryFromFilters, buildMultiSort } = require('eva-utilities/utils/filter-builder-v2');

module.exports = function ({ sequelize, UnknownError }) {
  return {
    createRFQ,
    getRFQs,
    getRFQById,
    updateRFQById,
    deleteRFQById,
    findByRFQNumber,
    getRFQWithDetails,
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

  function normalizeSort(sort, defaultSort = 'rfq_master.created_at DESC') {
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

  async function findByRFQNumber({ rfq_number, logger }) {
    try {
      const sql = `
        SELECT * FROM public.rfq_master
        WHERE rfq_number = $1
        LIMIT 1
      `;
      const [row] = await sequelize.query(sql, {
        replacements: [rfq_number],
        type: sequelize.QueryTypes.SELECT,
      });

      logger?.debug({ rfq_number, found: !!row }, 'findByRFQNumber');
      return row;
    } catch (err) {
      logger?.error({ err, rfq_number }, 'Error in findByRFQNumber');
      throw new UnknownError('Failed to query database');
    }
  }

  async function createRFQ({ rfqData, logger }) {
    const t = await sequelize.transaction();

    try {
      const {
        rfq_number,
        title,
        procurement_officer_id,
        status,
        deadline,
        notes,
        total_estimated_amount,
        currency,
        rfq_details,
        created_by,
      } = rfqData;

      // Create RFQ Master
      const insertMasterSql = `
        INSERT INTO public.rfq_master (
          rfq_number, title, procurement_officer_id, status, deadline,
          notes, total_estimated_amount, currency, created_at, updated_at, created_by
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, $9)
        RETURNING *
      `;

      const [rfqMaster] = await sequelize.query(insertMasterSql, {
        replacements: [
          rfq_number,
          title,
          procurement_officer_id,
          status || 'DRAFT',
          deadline,
          notes,
          total_estimated_amount || 0,
          currency || 'INR',
          created_by,
        ],
        type: sequelize.QueryTypes.SELECT,
        transaction: t,
      });

      // Create RFQ Details if provided
      if (Array.isArray(rfq_details) && rfq_details.length > 0) {
        for (const detail of rfq_details) {
          const insertDetailSql = `
            INSERT INTO public.rfq_details (
              rfq_master_id, item_description, quantity, unit, estimated_price,
              category, specifications, attachment_url, created_at
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, CURRENT_TIMESTAMP)
          `;

          await sequelize.query(insertDetailSql, {
            replacements: [
              rfqMaster.id,
              detail.item_description,
              detail.quantity,
              detail.unit || 'NOS',
              detail.estimated_price,
              detail.category,
              detail.specifications,
              detail.attachment_url,
            ],
            type: sequelize.QueryTypes.INSERT,
            transaction: t,
          });
        }
      }

      await t.commit();

      logger?.info({ rfq_id: rfqMaster.id, rfq_number }, 'RFQ created successfully');
      return rfqMaster;
    } catch (err) {
      await t.rollback();
      logger?.error({ err }, 'Error in createRFQ');
      throw new UnknownError('Failed to create RFQ');
    }
  }

  async function getRFQs({ limit, offset, filter, sort, logger }) {
    try {
      const { clause: filterClause, params: filterParams } = normalizeFilter(filter);
      const { clause: sortClause, params: sortParams } = normalizeSort(sort);

      let whereCondition = 'WHERE 1=1';
      if (filterClause) {
        whereCondition += ` AND ${filterClause}`;
      }

      const countSql = `SELECT COUNT(*) as total FROM public.rfq_master ${whereCondition}`;
      const [countResult] = await sequelize.query(countSql, {
        replacements: filterParams,
        type: sequelize.QueryTypes.SELECT,
      });

      const dataSql = `
        SELECT 
          rm.*,
          um.name as procurement_officer_name
        FROM public.rfq_master rm
        LEFT JOIN user_master um ON rm.procurement_officer_id = um.id
        ${whereCondition}
        ORDER BY ${sortClause}
        LIMIT $${filterParams.length + 1} OFFSET $${filterParams.length + 2}
      `;

      const rows = await sequelize.query(dataSql, {
        replacements: [...filterParams, limit, offset],
        type: sequelize.QueryTypes.SELECT,
      });

      logger?.debug({ count: rows.length, total: countResult.total }, 'getRFQs');
      return {
        data: rows,
        total: parseInt(countResult.total, 10),
        limit,
        offset,
      };
    } catch (err) {
      logger?.error({ err }, 'Error in getRFQs');
      throw new UnknownError('Failed to fetch RFQs');
    }
  }

  async function getRFQById({ id, logger }) {
    try {
      const sql = `
        SELECT 
          rm.*,
          um.name as procurement_officer_name
        FROM public.rfq_master rm
        LEFT JOIN user_master um ON rm.procurement_officer_id = um.id
        WHERE rm.id = $1
        LIMIT 1
      `;
      const [row] = await sequelize.query(sql, {
        replacements: [id],
        type: sequelize.QueryTypes.SELECT,
      });

      logger?.debug({ id, found: !!row }, 'getRFQById');
      return row;
    } catch (err) {
      logger?.error({ err, id }, 'Error in getRFQById');
      throw new UnknownError('Failed to fetch RFQ');
    }
  }

  async function getRFQWithDetails({ id, logger }) {
    try {
      const masterSql = `
        SELECT 
          rm.*,
          um.name as procurement_officer_name
        FROM public.rfq_master rm
        LEFT JOIN user_master um ON rm.procurement_officer_id = um.id
        WHERE rm.id = $1
        LIMIT 1
      `;
      const [master] = await sequelize.query(masterSql, {
        replacements: [id],
        type: sequelize.QueryTypes.SELECT,
      });

      if (!master) {
        return null;
      }

      const detailsSql = `
        SELECT * FROM public.rfq_details
        WHERE rfq_master_id = $1
      `;
      const details = await sequelize.query(detailsSql, {
        replacements: [id],
        type: sequelize.QueryTypes.SELECT,
      });

      // Get quotations count for each RFQ detail
      const quotationsSql = `
        SELECT 
          rfq_details_id,
          COUNT(*) as quotation_count,
          SUM(CASE WHEN status = 'ACCEPTED' THEN 1 ELSE 0 END) as accepted_count
        FROM public.rfq_vendor_quotations
        WHERE rfq_details_id = ANY($1::bigint[])
        GROUP BY rfq_details_id
      `;

      const detailIds = details.map((d) => d.id);
      const quotations = detailIds.length > 0
        ? await sequelize.query(quotationsSql, {
          replacements: [detailIds],
          type: sequelize.QueryTypes.SELECT,
        })
        : [];

      const quotationMap = quotations.reduce((acc, q) => {
        acc[q.rfq_details_id] = q;
        return acc;
      }, {});

      const enrichedDetails = details.map((detail) => ({
        ...detail,
        quotation_count: quotationMap[detail.id]?.quotation_count || 0,
        accepted_count: quotationMap[detail.id]?.accepted_count || 0,
      }));

      logger?.debug({ id, detailsCount: details.length }, 'getRFQWithDetails');
      return {
        ...master,
        rfq_details: enrichedDetails,
      };
    } catch (err) {
      logger?.error({ err, id }, 'Error in getRFQWithDetails');
      throw new UnknownError('Failed to fetch RFQ with details');
    }
  }

  async function updateRFQById({ id, updateData, logger }) {
    try {
      const allowedFields = [
        'title',
        'status',
        'deadline',
        'notes',
        'total_estimated_amount',
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
        UPDATE public.rfq_master
        SET ${updates.join(', ')}, updated_at = CURRENT_TIMESTAMP
        WHERE id = $${paramIndex}
        RETURNING *
      `;

      const [updatedRow] = await sequelize.query(sql, {
        replacements: params,
        type: sequelize.QueryTypes.SELECT,
      });

      logger?.info({ id, updatedFields: Object.keys(updateData) }, 'RFQ updated successfully');
      return updatedRow;
    } catch (err) {
      logger?.error({ err, id }, 'Error in updateRFQById');
      throw new UnknownError('Failed to update RFQ');
    }
  }

  async function deleteRFQById({ id, logger }) {
    const t = await sequelize.transaction();

    try {
      // Delete RFQ Details first
      const deleteDetailsSql = 'DELETE FROM public.rfq_details WHERE rfq_master_id = $1';
      await sequelize.query(deleteDetailsSql, {
        replacements: [id],
        type: sequelize.QueryTypes.DELETE,
        transaction: t,
      });

      // Delete RFQ Master
      const deleteMasterSql = 'DELETE FROM public.rfq_master WHERE id = $1 RETURNING *';
      const [deletedRow] = await sequelize.query(deleteMasterSql, {
        replacements: [id],
        type: sequelize.QueryTypes.SELECT,
        transaction: t,
      });

      await t.commit();

      logger?.info({ id, rfq_number: deletedRow?.rfq_number }, 'RFQ deleted successfully');
      return deletedRow;
    } catch (err) {
      await t.rollback();
      logger?.error({ err, id }, 'Error in deleteRFQById');
      throw new UnknownError('Failed to delete RFQ');
    }
  }
};
