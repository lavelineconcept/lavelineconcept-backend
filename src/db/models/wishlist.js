import { model, Schema } from 'mongoose';

const wishlistSchema = new Schema(
    {
        userId: { type: Schema.Types.ObjectId, ref: 'users', required: true, unique: true },
        products: [{ type: Schema.Types.ObjectId, ref: 'products' }],
    },
    { timestamps: true, versionKey: false },
);

export const WishlistsCollection = model('wishlists', wishlistSchema);
