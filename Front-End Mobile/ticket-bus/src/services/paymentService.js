import apiClient from "./apiClient";

const createPayment = async (boletoId, userId) => {
    try {
        const response = await apiClient.post('/payment/process', { boletoId, userId });
        return response.data;
    } catch (error) {
        console.error('Error creating payment:', error.response ? error.response.data : error.message);
        throw error;
    }
};

const capturePayment = async (paymentIntentId, compraId) => {
    try {
        const response = await apiClient.post('/payment/success', { paymentIntentId, compraId });
        return response.data;
    } catch (error) {
        console.error('Error capturing payment:', error.response ? error.response.data : error.message);
        throw error;
    }
};

const validateQR = async (qrCode) => {
    try {
        const response = await apiClient.post('/payment/validate-qr', { qrCode });
        return response.data;
    } catch (error) {
        console.error('Error validating QR code:', error.response ? error.response.data : error.message);
        throw error;
    }
};

export default {
    createPayment,
    capturePayment,
    validateQR,
};