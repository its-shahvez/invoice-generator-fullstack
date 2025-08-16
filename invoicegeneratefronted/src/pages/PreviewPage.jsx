import { useContext, useEffect, useRef, useState } from "react";
import { templates } from "../assets/assets";
import {AppContext} from "../context/AppContext"
import InvoicePreview from "../components/InvoicePreview";
import { deleteInvoice, saveInvoice, sendInvoice } from "../services/invoiceService";
import toast from "react-hot-toast";
import { Await, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import html2canvas from "html2canvas";
import { uploadInvoiceThumbnail } from "../services/cloudnaryService";
import { generatePdfFromElement } from "../util/pdfUtil";
import { useAuth, useUser } from "@clerk/clerk-react";

const PreviewPage = () =>{
    const previewRef    = useRef();

    const {selectedTemplate, invoiceData, setSelectedTemplate, baseURL} = useContext(AppContext)

    const [loading, setLoading] = useState(false)

    const [downloading,setDownloading] = useState(false);

    const [showModel , setShowModel] = useState(false);
    
    const [customerEmail , setCustomerEmail] = useState("");
    const [emailing, setEmailing ] = useState(false);

    const navigate = useNavigate()
    const {getToken} = useAuth();
    const {user} =   useUser();

    const handleSaveAndExit = async() =>{
        try {
            setLoading(true);

          const canvas =  await  html2canvas(previewRef.current,{
                scale:2,
                useCORS:true,
                backgroundColor:"#fff",
                scrollY:-window.scrollY,
            })

            const imageData =canvas.toDataURL("image/png");
            const thumbnailUrl =   await  uploadInvoiceThumbnail(imageData)

            const payload ={
                ...invoiceData,
                clerkId : user.id,
                thumbnailUrl,
                template: selectedTemplate
            }
            const token = await  getToken();
            const response = await saveInvoice(baseURL, payload, token)
            if(response.status===200){
                toast.success("Invoice saved Successfully");
                navigate("/dashboard");

            }else{
                toast.error("Something went wrong");
            }
        } catch (error) {
            console.error(error);
            toast.error("Failed to save invoice:", error.message);
            
        } finally{
            setLoading(false);
        }

    }

    const handleDelete = async () =>{
        if(!invoiceData.id){
            toast.success(" Invoice Delete Successfully");
            navigate("/dashboard");
        }
        
        try {
              const token = await getToken()
            const response =await deleteInvoice(baseURL, invoiceData.id,token);
            if( response.status ===204){
                toast.success(" Invoice Delete Successfully");
                navigate("/dashboard");
             }else{
                toast.error("Unable to Delete Invoice ")
             }
        } catch (error) {
            toast.error("Failed to Delete invoice", error.message);
            
        }
           
    }

    const handleDownloadPdf = async() =>{
        if(!previewRef.current) return;

        try {
            setDownloading(true);
            await  generatePdfFromElement(previewRef.current, `invoice_${Date.now()}.pdf`);
        } catch (error) {
            toast.error("Failed to generate invoice", error.message);
 
        }finally{
            setDownloading(false);
        }


    }

    const handleSendEmail = async () => {
    // Step 1: Validate input
    if (!previewRef.current || !customerEmail) {
        return toast.error("Please enter a valid email address and try again.");
    }

    try {
        setEmailing(true);

       
        // We create a variable for the filename to use it in two places.
        const fileName = `invoice_${Date.now()}.pdf`;
    
        
        // This generates the PDF data from your invoice component.
        const pdfBlob = await generatePdfFromElement(previewRef.current, fileName, true);
        
        // Step 4: FormData
        const formData = new FormData();
       
       
        // --- THIS IS THE MOST IMPORTANT CHANGE ---
       
        // This is the critical fix: we add the filename as the third argument.
        formData.append("file", pdfBlob, fileName);
    
        
        // The email field does not need a third argument.
        formData.append("email", customerEmail);

        // Step 5: API
        const token = await getToken()
        const response = await sendInvoice(baseURL, token, formData);
        
        // Step 6:
        if (response.status === 200) {
            toast.success("Email sent successfully!");
            setShowModel(false);
            setCustomerEmail("");
        } else {
            toast.error("Failed to send email. Please try again.");
        }
        
    } catch (error) {
        // --- YAHAN BHI EK ZAROORI BADLAV HAI --- 
        // We added console.error(error) to log the full error object for better debugging.
        console.error("Failed to send email:", error);
        toast.error("Failed to send the email. Check console for details.");
        
    } finally {
        setEmailing(false);
    }
};
    useEffect(() =>{
        if(!invoiceData || !invoiceData.items?.length){
            toast.error("Invoice data is empty");
            navigate("/dashboard");
        }
    },[invoiceData,navigate]);


    return(
        <div className="previewpage conatiner-fluid d-flex flex-column p-3 min-vh-100">

            {/* Action Button */}
            <div className="d-flex flex-column align-items-center mb-4 gap-3">

                {/* List of template buttons */}
                <div className="d-flex gap-2 flex-wrap justify-content-center">
                    {templates.map(({id, label}) => (
                        <button key={id}
                        style={{minWidth:"100px", height:"38px"}}
                        
                        onClick={()=> setSelectedTemplate(id)}
                        className={`btn btn-sm rounded-pill p-2 ${selectedTemplate === id ? 'btn-warning':'btn-outline-secondary'}`}>
                            {label}
                        </button>
                    ))}

                </div>

                {/*list of actions buttons */}
                <div className="d-flex gap-2 flex-wrap justify-content-center">
                    <button className="btn btn-primary d-flex align-items-center justify-content-center" onClick={handleSaveAndExit} disabled={loading}>
                        {loading && <Loader2 className="me-2 spin-animation" size={18}/>}
                        {loading ? "Saving..." :"Save And Exit"}

                    </button>
                    <button className="btn btn-danger" onClick={handleDelete}>Delete Invoice</button>
                    <button className="btn btn-secondary" onClick={() => navigate("/dashboard")}>Back to Dashboard</button>
                    <button className="btn btn-info" onClick={() => setShowModel(true)}>Send Email</button>
                    <button className="btn btn-success d-flex align-items-center justify-content-center" disabled={loading} onClick={handleDownloadPdf}>
                        {downloading  &&(
                           <Loader2 className="me-2 spin-animation" size={18}/>
                        )}
                       
                       {downloading ? "Downloading..." :"Download PDF"}
                        
                        </button>

                </div>

            </div>
            {/* display the invoice preview */}
            <div className="flex-grow-1 overflow-auto d-flex justify-content-center align-items-start bg-light py-3">

                <div ref={previewRef} className="invoice-preview">
                  <InvoicePreview invoiceData={invoiceData} template={selectedTemplate}/>

                </div>

            </div>

            {showModel && (
                <div className="modal d-block" tabIndex="-1" role="dialog" style={{backgroundColor:"rgba(0,0,0,0.5)"}}>
                    <div className="modal-dialog" role="document">
                     <div className="modal-content">

                        <div className="modal-header">
                            <h5 className="modal-title">Send Invoice</h5>
                            <button type="button" className="btn-close" onClick={() => setShowModel(false)}></button>
                        </div>
                        <div className="modal-body">
                           <input type="email"  className="form-control" placeholder="Customer email" onChange={(e) => setCustomerEmail(e.target.value)} value={customerEmail}/>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-primary" onClick={ handleSendEmail} disabled={emailing}>
                                {emailing ? "Sending...": "Send"}
                            </button>
                            <button type="button" className="btn btn-secondary" onClick={() => setShowModel(false)}> Cancel</button>
                        </div>
                     </div>

                    </div>

                </div>
            )}

        </div>
    )
}
export default PreviewPage;