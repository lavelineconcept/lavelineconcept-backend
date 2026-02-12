import {
    getWishlistByUserId,
    addProductToWishlist,
    removeProductFromWishlist,
    createWishlist,
} from '../services/wishlist.js';

export const getWishlistController = async (req, res) => {
    const userId = req.user._id;
    let wishlist = await getWishlistByUserId(userId);

    if (!wishlist.userId) {
        // Ensure wishlist exists in DB for consistency, though service handles implicit check.
        // Here we just return the empty structure provided by service if not found.
    }

    res.json({
        status: 200,
        message: 'Wishlist retrieved successfully',
        data: wishlist,
    });
};

export const addToWishlistController = async (req, res) => {
    const userId = req.user._id;
    const { productId } = req.body;

    const wishlist = await addProductToWishlist(userId, productId);

    res.status(200).json({
        status: 200,
        message: 'Product added to wishlist successfully',
        data: wishlist,
    });
};

export const removeFromWishlistController = async (req, res) => {
    const userId = req.user._id;
    const { productId } = req.params;

    const wishlist = await removeProductFromWishlist(userId, productId);

    res.json({
        status: 200,
        message: 'Product removed from wishlist successfully',
        data: wishlist,
    });
};
