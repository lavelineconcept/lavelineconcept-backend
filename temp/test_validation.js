import Joi from 'joi';

// Mocking the validation rules and schemas since importing them might be complex with ES modules in a scratch script
const VALIDATION_RULES = {
    PRODUCT_TITLE: { MIN: 3, MAX: 100 },
    PRODUCT_DESCRIPTION: { MIN: 10 },
    PRODUCT_BRAND: { MAX: 50 },
    MONGO_ID_LENGTH: 24
};

const createProductSchema = Joi.object({
    title: Joi.string().min(VALIDATION_RULES.PRODUCT_TITLE.MIN).max(VALIDATION_RULES.PRODUCT_TITLE.MAX).required(),
    description: Joi.string().min(VALIDATION_RULES.PRODUCT_DESCRIPTION.MIN).required(),
    price: Joi.number().min(0).required(),
    stock: Joi.number().min(0).default(0),
    brand: Joi.string().max(VALIDATION_RULES.PRODUCT_BRAND.MAX),
    stockCode: Joi.string().allow('', null), // The field we added
    categoryId: Joi.string().hex().length(VALIDATION_RULES.MONGO_ID_LENGTH).required(),
});

const testData = [
    {
        name: "Valid with stockCode",
        data: {
            title: "Test Product",
            description: "A very nice test product description",
            price: 100,
            stock: 10,
            brand: "BrandX",
            stockCode: "SCO-123",
            categoryId: "60d5ec49f3e1c2b3d4e5f6a1"
        }
    },
    {
        name: "Valid without stockCode (undefined)",
        data: {
            title: "Test Product No Code",
            description: "A very nice test product description without code",
            price: 100,
            stock: 10,
            brand: "BrandX",
            categoryId: "60d5ec49f3e1c2b3d4e5f6a1"
        }
    },
    {
        name: "Valid with empty stockCode",
        data: {
            title: "Test Product Empty Code",
            description: "A very nice test product description with empty code",
            price: 100,
            stock: 10,
            brand: "BrandX",
            stockCode: "",
            categoryId: "60d5ec49f3e1c2b3d4e5f6a1"
        }
    },
    {
        name: "Valid with null stockCode",
        data: {
            title: "Test Product Null Code",
            description: "A very nice test product description with null code",
            price: 100,
            stock: 10,
            brand: "BrandX",
            stockCode: null,
            categoryId: "60d5ec49f3e1c2b3d4e5f6a1"
        }
    }
];

testData.forEach(test => {
    const { error } = createProductSchema.validate(test.data);
    if (error) {
        console.error(`[-] Test Failed: ${test.name}`);
        console.error(error.details);
    } else {
        console.log(`[+] Test Passed: ${test.name}`);
    }
});
