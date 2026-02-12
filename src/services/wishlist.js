import { WishlistsCollection } from '../db/models/wishlist.js';

export const getWishlistByUserId = async (userId) => {
    const wishlist = await WishlistsCollection.findOne({ userId }).populate('products');

    if (!wishlist) {
        return { products: [] };
    }

    return wishlist;
};

export const createWishlist = async (userId) => {
    return await WishlistsCollection.create({ userId, products: [] });
};

export const addProductToWishlist = async (userId, productId) => {
    let wishlist = await WishlistsCollection.findOne({ userId });

    if (!wishlist) {
        wishlist = await WishlistsCollection.create({ userId, products: [] });
    }

    // Add only if not already in list
    if (!wishlist.products.includes(productId)) {
        wishlist.products.push(productId);
        await wishlist.save();
    }

    // Return populated wishlist
    return await getWishlistByUserId(userId);
};

export const removeProductFromWishlist = async (userId, productId) => {
    const wishlist = await WishlistsCollection.findOne({ userId });

    if (wishlist) {
        wishlist.products.pull(productId);
        await wishlist.save();
    }

    return await getWishlistByUserId(userId);
};
