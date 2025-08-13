import axios from "axios";

export const uploadInvoiceThumbnail = async (imageData) =>{
    const formData = new FormData();
    formData.append('file', imageData);
    formData.append('upload_preset', 'invoices_thumbnail');
    formData.append('cloud_name', "davkyi4hd");

     const  response= await axios.post(`https://api.cloudinary.com/v1_1/davkyi4hd/image/upload`, formData);

     return response.data.secure_url;



}