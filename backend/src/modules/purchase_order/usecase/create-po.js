'use strict';

module.exports = function ({
  poDb,
  rfqDb,
  Joi,
  sequelize,
  UnknownError,
  ValidationError,
  ConflictError,
}) {
  return async function createPO({
    poData,
    createdBy,
    logger,
  }) {
    logger?.info(
      { po_number: poData?.po_number, vendor_id: poData?.vendor_id },
      'Create PO Use Case started'
    );

    try {
      const schema = Joi.object({
        po_number: Joi.string().max(50).required(),
        vendor_id: Joi.number().required(),
        procurement_officer_id: Joi.number().required(),
        po_date: Joi.date().required(),
        delivery_date: Joi.date().required(),
        total_amount: Joi.number().precision(2).default(0).optional(),
        tax_amount: Joi.number().precision(2).default(0).optional(),
        grand_total: Joi.number().precision(2).optional(),
        currency: Joi.string().max(3).default('INR').optional(),
        notes: Joi.string().allow(null, '').optional(),
        status: Joi.string().valid('DRAFT', 'APPROVED', 'PARTIALLY_RECEIVED', 'RECEIVED', 'CANCELLED', 'CLOSED').default('DRAFT').optional(),
        approval_status: Joi.string().valid('PENDING', 'APPROVED', 'REJECTED').default('PENDING').optional(),
        po_details: Joi.array()
          .items(
            Joi.object({
              item_id: Joi.number().required(),
              vendor_item_id: Joi.number().optional(),
              rfq_details_id: Joi.number().optional(),
              quantity: Joi.number().precision(3).required(),
              unit_price: Joi.number().precision(2).required(),
              total_price: Joi.number().precision(2).optional(),
              unit: Joi.string().max(20).default('NOS').optional(),
              tax_rate: Joi.number().precision(2).default(0).optional(),
              tax_amount: Joi.number().precision(2).default(0).optional(),
              status: Joi.string().valid('PENDING', 'ACCEPTED', 'RECEIVED', 'CANCELLED').default('PENDING').optional(),
            })
          )
          .min(1)
          .required(),
      });

      const { error, value } = schema.validate(poData, {
        abortEarly: false,
        stripUnknown: true,
      });

      if (error) {
        logger?.warn(
          { validationErrors: error.details.map((d) => d.message) },
          'Joi validation failed for PO creation'
        );
        const err = new ValidationError('Invalid PO input');
        err.details = error.details.map((d) => ({
          message: d.message,
          field: d.path.join('.'),
        }));
        throw err;
      }

      const normalizedPO = value;

      // Check if PO number already exists
      const existingByNumber = await poDb.findByPONumber({
        po_number: normalizedPO.po_number,
        logger,
      });
      if (existingByNumber) {
        throw new ConflictError('PO number already exists');
      }

      // Create PO
      const createdPO = await poDb.createPO({
        poData: normalizedPO,
        logger,
      });

      logger?.info(
        { po_id: createdPO.id, po_number: createdPO.po_number },
        'PO created successfully'
      );

      // Auto-create RFQ Master and RFQ Details
      logger?.info(
        { po_id: createdPO.id },
        'Starting auto-creation of RFQ Master and Details'
      );

      const rfqData = {
        rfq_number: `RFQ-${createdPO.po_number}`,
        title: `RFQ for PO ${createdPO.po_number}`,
        procurement_officer_id: normalizedPO.procurement_officer_id,
        status: 'OPEN',
        deadline: normalizedPO.delivery_date,
        notes: `Auto-generated from PO: ${createdPO.po_number}`,
        total_estimated_amount: normalizedPO.grand_total || normalizedPO.total_amount,
        currency: normalizedPO.currency || 'INR',
        rfq_details: normalizedPO.po_details.map((detail) => ({
          item_description: `Item ID: ${detail.item_id}`,
          quantity: detail.quantity,
          unit: detail.unit || 'NOS',
          estimated_price: detail.unit_price,
          category: 'Procurement',
        })),
      };

      // Use transaction to create RFQ atomically
      const t = await sequelize.transaction();

      try {
        // Create RFQ Master
        const rfqInsertSql = `
          INSERT INTO public.rfq_master (
            rfq_number, title, procurement_officer_id, status, deadline,
            notes, total_estimated_amount, currency, created_at, updated_at, created_by
          )
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, $9)
          RETURNING *
        `;

        const [createdRFQ] = await sequelize.query(rfqInsertSql, {
          replacements: [
            rfqData.rfq_number,
            rfqData.title,
            rfqData.procurement_officer_id,
            rfqData.status,
            rfqData.deadline,
            rfqData.notes,
            rfqData.total_estimated_amount,
            rfqData.currency,
            createdBy,
          ],
          type: sequelize.QueryTypes.SELECT,
          transaction: t,
        });

        // Create RFQ Details
        for (const detail of rfqData.rfq_details) {
          const rfqDetailSql = `
            INSERT INTO public.rfq_details (
              rfq_master_id, item_description, quantity, unit,
              estimated_price, category, created_at
            )
            VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP)
          `;

          await sequelize.query(rfqDetailSql, {
            replacements: [
              createdRFQ.id,
              detail.item_description,
              detail.quantity,
              detail.unit,
              detail.estimated_price,
              detail.category,
            ],
            type: sequelize.QueryTypes.INSERT,
            transaction: t,
          });
        }

        // Link RFQ Master to PO Header
        const linkSql = `
          UPDATE public.po_header
          SET rfq_master_id = $1, updated_at = CURRENT_TIMESTAMP
          WHERE id = $2
        `;

        await sequelize.query(linkSql, {
          replacements: [createdRFQ.id, createdPO.id],
          type: sequelize.QueryTypes.UPDATE,
          transaction: t,
        });

        await t.commit();

        logger?.info(
          { rfq_id: createdRFQ.id, rfq_number: createdRFQ.rfq_number },
          'RFQ Master and Details auto-created successfully'
        );

        return {
          ...createdPO,
          rfq_master_id: createdRFQ.id,
          rfq_number: createdRFQ.rfq_number,
        };
      } catch (rfqErr) {
        await t.rollback();
        logger?.error(
          { err: rfqErr, po_id: createdPO.id },
          'Error creating RFQ, but PO was created'
        );
        // Return PO even if RFQ creation fails
        return createdPO;
      }
    } catch (error) {
      logger?.error(error, 'Error in createPO usecase');
      throw error;
    }
  };
};
