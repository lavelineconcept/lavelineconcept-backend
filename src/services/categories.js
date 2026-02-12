import { CategoriesCollection } from '../db/models/category.js';

export const getAllCategories = async () => {
    return await CategoriesCollection.find().populate('parentId');
};

export const createCategory = async (payload) => {
    return await CategoriesCollection.create(payload);
};

export const updateCategory = async (categoryId, payload, options = {}) => {
    const rawResult = await CategoriesCollection.findOneAndUpdate(
        { _id: categoryId },
        payload,
        {
            new: true,
            includeResultMetadata: true,
            ...options,
        },
    );

    return {
        category: rawResult.value,
        isNew: Boolean(rawResult.lastErrorObject.upserted),
    };
};

export const deleteCategory = async (categoryId) => {
    const category = await CategoriesCollection.findOneAndDelete({
        _id: categoryId,
    });

    return category;
};
