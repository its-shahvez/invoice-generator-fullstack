import axios from "axios";


// Hum baseUrl ko yahan environment variables se padh rahe hain.
const baseUrl = import.meta.env.VITE_API_BASE_URL;

// Ab sabhi functions mein se 'baseUrl' parameter ko hata diya gaya hai.

export const saveInvoice = (payload, token) => {
    return axios.post(`${baseUrl}/invoices`, payload, {
        headers: { Authorization: `Bearer ${token}` }
    });
};

export const getAllInvoices = (token) => {
    return axios.get(`${baseUrl}/invoices`, {
        headers: { Authorization: `Bearer ${token}` }
    });
};

export const deleteInvoice = (id, token) => {
    return axios.delete(`${baseUrl}/invoices/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
    });
};

export const sendInvoice = (formData, token) => {
    return axios.post(`${baseUrl}/invoices/sendinvoice`, formData, {
        headers: { Authorization: `Bearer ${token}` }
    });
};