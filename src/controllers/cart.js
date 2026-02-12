import {
    getCartByUserId,
    addItemToCart,
    updateItemQuantity,
    removeItemFromCart,
    clearCart,
    createCart,
    updateGiftWrap,
} from '../services/cart.js';

export const getCartController = async (req, res) => {
    const userId = req.user._id;
    let cart = await getCartByUserId(userId);

    if (!cart) {
        // Create empty cart if not exists
        await createCart(userId);
        cart = await getCartByUserId(userId);
    }

    res.json({
        status: 200,
        message: 'Cart retrieved successfully',
        data: cart,
    });
};

export const addToCartController = async (req, res) => {
    const userId = req.user._id;
    const cart = await addItemToCart(userId, req.body);

    res.status(200).json({
        status: 200,
        message: 'Item added to cart successfully',
        data: cart,
    });
};

export const updateCartItemController = async (req, res) => {
    const userId = req.user._id;
    const { itemId } = req.params;
    const { quantity } = req.body;

    const cart = await updateItemQuantity(userId, itemId, quantity);

    res.json({
        status: 200,
        message: 'Cart item updated successfully',
        data: cart,
    });
};

export const updateCartGiftWrapController = async (req, res) => {
    const userId = req.user._id;
    const { isGiftWrap } = req.body;

    const cart = await updateGiftWrap(userId, isGiftWrap);

    res.json({
        status: 200,
        message: 'Cart gift wrap updated successfully',
        data: cart,
    });
};

export const removeCartItemController = async (req, res) => {
    const userId = req.user._id;
    const { itemId } = req.params;

    const cart = await removeItemFromCart(userId, itemId);

    res.json({
        status: 200,
        message: 'Item removed from cart successfully',
        data: cart,
    });
};

export const clearCartController = async (req, res) => {
    const userId = req.user._id;
    await clearCart(userId);

    res.status(204).send();
};
