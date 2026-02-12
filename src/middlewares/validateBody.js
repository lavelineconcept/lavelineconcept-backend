import createHttpError from 'http-errors';

const validateBody = (schema) => async (req, res, next) => {
  try {
    await schema.validateAsync(req.body, {
      abortEarly: false,
      convert: true,
      stripUnknown: true,
    });
    next();
  } catch (err) {
    const error = createHttpError(400, 'Validation Error', {
      errors: err.details,
    });
    next(error);
  }
};

export default validateBody;
