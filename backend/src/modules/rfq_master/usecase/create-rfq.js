'use strict';

module.exports = function ({
  rfqDb,
  Joi,
  sequelize,
  UnknownError,
  ValidationError,
  ConflictError,
}) {
  return async function createRFQ({
    rfqData,
    createdBy,
    logger,
  }) {
    logger?.info(
      { rfq_number: rfqData?.rfq_number },
      'Create RFQ Use Case started'
    );

    try {
      const schema = Joi.object({
        rfq_number: Joi.string().max(50).required(),
        title: Joi.string().max(255).required(),
        procurement_officer_id: Joi.number().required(),
        status: Joi.string()
          .valid('DRAFT', 'OPEN', 'CLOSED', 'CANCELLED')
          .default('DRAFT')
          .optional(),
        deadline: Joi.date().required(),
        notes: Joi.string().allow(null, '').optional(),
        total_estimated_amount: Joi.number().precision(2).default(0).optional(),
        currency: Joi.string().max(3).default('INR').optional(),
        rfq_details: Joi.array()
          .items(
            Joi.object({
              item_description: Joi.string().required(),
              quantity: Joi.number().precision(3).required(),
              unit: Joi.string().max(20).default('NOS').optional(),
              estimated_price: Joi.number().precision(2).optional(),
              category: Joi.string().max(100).optional(),
              specifications: Joi.string().allow(null, '').optional(),
              attachment_url: Joi.string().allow(null, '').optional(),
            })
          )
          .min(1)
          .required(),
      });

      const { error, value } = schema.validate(rfqData, {
        abortEarly: false,
        stripUnknown: true,
      });

      if (error) {
        logger?.warn(
          { validationErrors: error.details.map((d) => d.message) },
          'Joi validation failed for RFQ creation'
        );
        const err = new ValidationError('Invalid RFQ input');
        err.details = error.details.map((d) => ({
          message: d.message,
          field: d.path.join('.'),
        }));
        throw err;
      }

      const normalizedRFQ = {
        ...value,
        created_by: createdBy,
      };

      // Check if RFQ number already exists
      const existingByNumber = await rfqDb.findByRFQNumber({
        rfq_number: normalizedRFQ.rfq_number,
        logger,
      });
      if (existingByNumber) {
        throw new ConflictError('RFQ number already exists');
      }

      // Create RFQ
      const createdRFQ = await rfqDb.createRFQ({
        rfqData: normalizedRFQ,
        logger,
      });

      logger?.info(
        { rfq_id: createdRFQ.id, rfq_number: createdRFQ.rfq_number },
        'RFQ created successfully'
      );

      return createdRFQ;
    } catch (error) {
      logger?.error(error, 'Error in createRFQ usecase');
      throw error;
    }
  };
};
