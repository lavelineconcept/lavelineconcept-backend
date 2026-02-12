import {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
} from '../services/products.js';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';

export const getProductsController = async (req, res) => {
    const { page, perPage, sortBy, sortOrder, category, minPrice, maxPrice, brand, search } =
        req.query;

    const products = await getAllProducts({
        page: Number(page),
        perPage: Number(perPage),
        sortBy,
        sortOrder,
        filter: { category, minPrice, maxPrice, brand, search },
    });

    res.json({
        status: 200,
        message: 'Products retrieved successfully',
        data: products,
    });
};

export const getProductByIdController = async (req, res) => {
    const { productId } = req.params;
    const product = await getProductById(productId);

    res.json({
        status: 200,
        message: `Product with id ${productId} retrieved successfully`,
        data: product,
    });
};

export const createProductController = async (req, res) => {
    let images = [];

    if (req.files && Array.isArray(req.files)) {
        for (const file of req.files) {
            const url = await saveFileToCloudinary(file);
            images.push(url);
        }
    }

    const product = await createProduct({
        ...req.body,
        images: images.length > 0 ? images : undefined,
    });

    res.status(201).json({
        status: 201,
        message: 'Product created successfully',
        data: product,
    });
};

export const updateProductController = async (req, res) => {
    const { productId } = req.params;
    let images = req.body.images;

    // Eğer images bir string olarak gelmişse (tek görsel veya hatalı format), diziye çevir
    if (images && !Array.isArray(images)) {
        images = [images];
    }

    // Eğer images hiç gelmemişse boş dizi yap (varsayılan)
    if (!images) {
        images = [];
    }

    // Yeni dosyalar yüklenmişse Cloudinary'ye gönder ve listeye ekle
    if (req.files && Array.isArray(req.files)) {
        for (const file of req.files) {
            const url = await saveFileToCloudinary(file);
            images.push(url);
        }
    }

    const result = await updateProduct(productId, {
        ...req.body,
        images: images.length > 0 ? images : undefined,
    });

    res.json({
        status: 200,
        message: 'Product updated successfully',
        data: result.product,
    });
};

export const deleteProductController = async (req, res) => {
    const { productId } = req.params;
    await deleteProduct(productId);

    res.status(204).send();
};
