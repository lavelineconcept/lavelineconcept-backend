import path from 'node:path';

export const SORT_ORDER = {
  ASC: 'asc',
  DESC: 'desc',
};
export const FIFTEEN_MINUTES = 15 * 60 * 1000;
export const ONE_DAY = 24 * 60 * 60 * 1000;
export const ONE_MONTH = 30 * ONE_DAY;

export const SMTP = {
  SMTP_HOST: 'SMTP_HOST',
  SMTP_PORT: 'SMTP_PORT',
  SMTP_USER: 'SMTP_USER',
  SMTP_PASSWORD: 'SMTP_PASSWORD',
  SMTP_FROM: 'SMTP_FROM',
};
export const TEMPLATES_DIR = path.join(process.cwd(), 'src', 'templates');
export const TEMP_UPLOAD_DIR = path.join(process.cwd(), 'temp');

export const UPLOAD_LIMITS = {
  FILE_SIZE: 5 * 1024 * 1024, // 5MB
  MAX_COUNT: 5,
};

export const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export const PAGINATION_DEFAULTS = {
  PAGE: 1,
  PER_PAGE: 10,
  SORT_BY: '_id',
  SORT_ORDER: 'asc',
};

export const CART_DEFAULTS = {
  MIN_QUANTITY: 1,
  DEFAULT_QUANTITY: 1,
};

export const VALIDATION_RULES = {
  MONGO_ID_LENGTH: 24,
  CATEGORY_NAME: { MIN: 3, MAX: 50 },
  CATEGORY_SLUG: { MIN: 3, MAX: 50 },
  PRODUCT_TITLE: { MIN: 3, MAX: 100 },
  PRODUCT_DESCRIPTION: { MIN: 10 },
  PRODUCT_BRAND: { MAX: 50 },
};

export const ORDER_STATUS = {
  PENDING: 'Pending',
  PROCESSING: 'Processing',
  SHIPPED: 'Shipped',
  DELIVERED: 'Delivered',
  CANCELLED: 'Cancelled',
};

export const PAYMENT_METHODS = {
  CREDIT_CARD: 'Credit Card',
  COD: 'Cash on Delivery',
  BANK_TRANSFER: 'Bank Transfer',
};
