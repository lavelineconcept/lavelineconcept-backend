import { CartsCollection } from '../db/models/cart.js';
import { CART_DEFAULTS } from '../constants/index.js';
import createHttpError from 'http-errors';

export const getCartByUserId = async (userId) => {
    const cart = await CartsCollection.findOne({ userId }).populate(
        'items.productId',
    );

    if (!cart) {
        return null;
    }

    // Calculate total amount dynamically
    const cartObject = cart.toObject();
    let totalAmount = 0;

    cartObject.items = cartObject.items.map((item) => {
        const product = item.productId;
        // If product was deleted, this might be null. Handle gracefully if needed.
        if (!product) return item;

        const itemTotal = product.price * item.quantity;
        totalAmount += itemTotal;
        return { ...item, itemTotal };
    });

    cartObject.totalAmount = totalAmount;

    return cartObject;
};

export const createCart = async (userId) => {
    return await CartsCollection.create({ userId, items: [] });
};

export const addItemToCart = async (userId, { productId, quantity = CART_DEFAULTS.DEFAULT_QUANTITY, selectedAttributes = {} }) => {
    let cart = await CartsCollection.findOne({ userId });

    if (!cart) {
        cart = await CartsCollection.create({ userId, items: [] });
    }

    // Check if item with same product AND same attributes already exists
    const existingItemIndex = cart.items.findIndex((item) => {
        return (
            item.productId.toString() === productId &&
            JSON.stringify(item.selectedAttributes) === JSON.stringify(selectedAttributes)
        );
    });

    if (existingItemIndex > -1) {
        cart.items[existingItemIndex].quantity += quantity;
    } else {
        cart.items.push({ productId, quantity, selectedAttributes });
    }

    await cart.save();
    return await getCartByUserId(userId);
};

export const updateItemQuantity = async (userId, itemId, quantity) => {
    const cart = await CartsCollection.findOne({ userId });

    if (!cart) {
        throw createHttpError(404, 'Cart not found');
    }

    const item = cart.items.id(itemId);
    if (!item) {
        throw createHttpError(404, 'Item not found in cart');
    }

    item.quantity = quantity;
    await cart.save();

    return await getCartByUserId(userId);
};

export const updateGiftWrap = async (userId, isGiftWrap) => {
    const cart = await CartsCollection.findOne({ userId });
    if (!cart) throw createHttpError(404, 'Cart not found');

    cart.isGiftWrap = isGiftWrap;
    await cart.save();

    return await getCartByUserId(userId);
};

export const removeItemFromCart = async (userId, itemId) => {
    const cart = await CartsCollection.findOne({ userId });
    if (!cart) throw createHttpError(404, 'Cart not found');

    cart.items.pull(itemId);
    await cart.save();

    return await getCartByUserId(userId);
};

export const clearCart = async (userId) => {
    const cart = await CartsCollection.findOne({ userId });
    if (!cart) throw createHttpError(404, 'Cart not found');

    cart.items = [];
    cart.isGiftWrap = false; // Reset gift wrap
    await cart.save();
    return cart; // Returns empty cart
};
