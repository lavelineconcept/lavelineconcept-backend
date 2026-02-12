import { model, Schema } from 'mongoose';

const productSchema = new Schema(
    {
        title: { type: String, required: true },
        description: { type: String, required: true },
        price: { type: Number, required: true },
        stock: { type: Number, required: true, default: 0 },
        brand: { type: String },
        categoryId: { type: Schema.Types.ObjectId, ref: 'categories', required: true },
        images: [{ type: String }], // Array of Cloudinary URLs
        attributes: { type: Map, of: String }, // e.g., { "Color": "Red", "Size": "M" }
    },
    { timestamps: true, versionKey: false },
);

export const ProductsCollection = model('products', productSchema);
