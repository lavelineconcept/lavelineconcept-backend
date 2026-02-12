import { model, Schema } from 'mongoose';
import { CART_DEFAULTS } from '../../constants/index.js';

const cartSchema = new Schema(
    {
        userId: { type: Schema.Types.ObjectId, ref: 'users', required: true, unique: true },
        items: [
            {
                productId: { type: Schema.Types.ObjectId, ref: 'products', required: true },
                quantity: {
                    type: Number,
                    required: true,
                    min: CART_DEFAULTS.MIN_QUANTITY,
                    default: CART_DEFAULTS.DEFAULT_QUANTITY,
                },
                selectedAttributes: { type: Map, of: String }, // e.g., { "Size": "M", "Color": "Blue" }
            },
        ],
        isGiftWrap: { type: Boolean, default: false },
    },
    { timestamps: true, versionKey: false },
);

export const CartsCollection = model('carts', cartSchema);
