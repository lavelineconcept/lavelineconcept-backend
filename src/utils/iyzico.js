import Iyzipay from 'iyzipay';
import { env } from './env.js';

const isEnabled = env('IYZICO_ENABLED', 'false') === 'true';
const apiKey = env('IYZICO_API_KEY', '');
const secretKey = env('IYZICO_SECRET_KEY', '');

let iyzico;

if (isEnabled && apiKey && secretKey) {
    iyzico = new Iyzipay({
        apiKey: apiKey,
        secretKey: secretKey,
        uri: env('IYZICO_BASE_URL', 'https://sandbox-api.iyzipay.com'),
    });
} else {
    // Return a mock object to prevent startup errors
    iyzico = {
        payment: {
            create: (request, callback) => {
                const error = new Error('Iyzico payment service is currently disabled.');
                callback(error, { status: 'failure', errorMessage: error.message });
            }
        },
        checkoutForm: {
            retrieve: (request, callback) => {
                const error = new Error('Iyzico payment service is currently disabled.');
                callback(error, { status: 'failure', errorMessage: error.message });
            }
        },
        _disabled: true
    };
}

export default iyzico;
