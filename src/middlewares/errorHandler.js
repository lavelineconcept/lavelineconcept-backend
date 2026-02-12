import { HttpError } from 'http-errors';

export const errorHandler = (err, req, res, next) => {
  // Always log the full error to console for debugging
  console.error('--- ERROR START ---');
  console.error(err);
  console.error('--- ERROR END ---');

  if (err instanceof HttpError) {
    res.status(err.status).json({
      status: err.status,
      message: err.name,
      data: err,
    });
    return;
  }

  res.status(500).json({
    status: 500,
    message: 'Something went wrong',
    data: err.message || 'Internal Server Error',
    stack: process.env.NODE_ENV !== 'production' ? err.stack : undefined,
  });
};
