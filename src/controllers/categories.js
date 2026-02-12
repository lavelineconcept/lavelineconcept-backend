import { getAllCategories, createCategory, updateCategory, deleteCategory } from '../services/categories.js';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';
import createHttpError from 'http-errors';

export const getCategoriesController = async (req, res) => {
    const categories = await getAllCategories();

    res.json({
        status: 200,
        message: 'Categories retrieved successfully',
        data: categories,
    });
};

export const createCategoryController = async (req, res) => {
    let photoUrl;

    if (req.file) {
        photoUrl = await saveFileToCloudinary(req.file);
    }

    const category = await createCategory({
        ...req.body,
        image: photoUrl,
    });

    res.status(201).json({
        status: 201,
        message: 'Category created successfully',
        data: category,
    });
};

export const updateCategoryController = async (req, res, next) => {
    const { categoryId } = req.params;
    let photoUrl;

    if (req.file) {
        photoUrl = await saveFileToCloudinary(req.file);
    }

    const result = await updateCategory(categoryId, {
        ...req.body,
        ...(photoUrl && { image: photoUrl }),
    });

    if (!result.category) {
        throw createHttpError(404, 'Category not found');
    }

    res.json({
        status: 200,
        message: 'Successfully patched a category!',
        data: result.category,
    });
};

export const deleteCategoryController = async (req, res, next) => {
    const { categoryId } = req.params;

    const category = await deleteCategory(categoryId);

    if (!category) {
        throw createHttpError(404, 'Category not found');
    }

    res.status(204).send();
};
