import { model, Schema } from 'mongoose';

const categorySchema = new Schema(
    {
        name: { type: String, required: true },
        slug: { type: String, required: true, unique: true },
        parentId: { type: Schema.Types.ObjectId, ref: 'categories', default: null },
        image: { type: String },
    },
    { timestamps: true, versionKey: false },
);

export const CategoriesCollection = model('categories', categorySchema);
