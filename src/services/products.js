import { ProductsCollection } from '../db/models/product.js';
import { PAGINATION_DEFAULTS } from '../constants/index.js';
import createHttpError from 'http-errors';

export const getAllProducts = async ({
    page = PAGINATION_DEFAULTS.PAGE,
    perPage = PAGINATION_DEFAULTS.PER_PAGE,
    sortBy = PAGINATION_DEFAULTS.SORT_BY,
    sortOrder = PAGINATION_DEFAULTS.SORT_ORDER,
    filter = {},
}) => {
    const skip = (page - 1) * perPage;

    const productsQuery = ProductsCollection.find();

    if (filter.category) {
        productsQuery.where('categoryId').equals(filter.category);
    }
    if (filter.minPrice) {
        productsQuery.where('price').gte(filter.minPrice);
    }
    if (filter.maxPrice) {
        productsQuery.where('price').lte(filter.maxPrice);
    }
    if (filter.brand) {
        productsQuery.where('brand').equals(filter.brand);
    }
    if (filter.search) {
        const searchRegex = new RegExp(filter.search, 'i');
        productsQuery.where({
            $or: [
                { title: searchRegex },
                { description: searchRegex }
            ]
        });
    }

    const [productsCount, products] = await Promise.all([
        ProductsCollection.countDocuments(productsQuery),
        productsQuery
            .sort({ [sortBy]: sortOrder })
            .skip(skip)
            .limit(perPage)
            .populate('categoryId'),
    ]);

    const totalPages = Math.ceil(productsCount / perPage);

    return {
        data: products,
        page,
        perPage,
        totalItems: productsCount,
        totalPages,
        hasNextPage: totalPages - page > 0,
        hasPreviousPage: page > 1,
    };
};

export const getProductById = async (productId) => {
    const product = await ProductsCollection.findById(productId).populate(
        'categoryId',
    );
    if (!product) {
        throw createHttpError(404, 'Product not found');
    }
    return product;
};

export const createProduct = async (payload) => {
    return await ProductsCollection.create(payload);
};

export const updateProduct = async (productId, payload, options = {}) => {
    const rawResult = await ProductsCollection.findOneAndUpdate(
        { _id: productId },
        payload,
        {
            new: true,
            includeResultMetadata: true,
            ...options,
        },
    );

    if (!rawResult || !rawResult.value) {
        throw createHttpError(404, 'Product not found');
    }

    return {
        product: rawResult.value,
        isNew: Boolean(rawResult?.lastErrorObject?.upserted),
    };
};

export const deleteProduct = async (productId) => {
    const product = await ProductsCollection.findOneAndDelete({
        _id: productId,
    });

    if (!product) {
        throw createHttpError(404, 'Product not found');
    }
};
