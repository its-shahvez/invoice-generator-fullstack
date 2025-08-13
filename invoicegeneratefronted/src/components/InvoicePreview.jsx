import { forwardRef } from "react";
import { FormatInvoiceData } from "../util/FormatInvoiceData";
import { templateComponents } from "../util/InvoiceTemplates";

const InvoicePreview = forwardRef(({invoiceData, template} ,ref ) =>{

   const formatedData =  FormatInvoiceData(invoiceData)

   const SelectedTemplate= templateComponents[template] || templateComponents["template1"];
    return(
        <div ref={ref} className="invoice-preview container px-2 py-2 overflow-x-auto">

             <SelectedTemplate data = {formatedData} />
            
        </div>
    )
})
export default InvoicePreview;