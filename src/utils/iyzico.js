import Iyzipay from 'iyzipay';
import { env } from './env.js';

const iyzico = new Iyzipay({
    apiKey: env('IYZICO_API_KEY'),
    secretKey: env('IYZICO_SECRET_KEY'),
    uri: env('IYZICO_BASE_URL', 'https://sandbox-api.iyzipay.com'),
});

export default iyzico;
