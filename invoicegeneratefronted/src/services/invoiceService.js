import axios from "axios";


const baseUrl = import.meta.env.VITE_API_BASE_URL;



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