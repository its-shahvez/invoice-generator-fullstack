import { Pencil } from "lucide-react";
import { useContext, useState } from "react";
import { AppContext } from "../context/AppContext";
import InvoiceForm from "../components/InvoiceForm";
import TemplateGrid from "../components/TemplateGrid";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const MainPage = () =>{

    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const navigate = useNavigate();
    const {invoiceTitle, setInvoiceTitle,invoiceData, setInvoiceData,setSelectedTemplate} = useContext(AppContext);

    const handleTemplateClick =(templateId) =>{

      const hasInvalidItem =   invoiceData.items.some(
           (item) => !item.qty || !item.amount
        );


        if(hasInvalidItem){
            toast.error("Please Enter Quantity and Amount for all Items.");
            return;
        }
        setSelectedTemplate(templateId);
        navigate("/preview");
        
  
    }


    const handleTitleChange = (e) => {
        const newTile = e.target.value;
        setInvoiceTitle(newTile);
        setInvoiceData((prev) =>({
            ...prev,
          title: newTile
        }))

    }

    const handleTitleEdit = () =>{
        setIsEditingTitle(true);

    }

    const handleTitleBlur = () =>{
        setIsEditingTitle(false);

    }


    return(
        <div className=" mainpage container-fluid bg-light min-vh-100 py-4">
            <div className="container">

                {/* tile bar */}
               <div className="bg-white border rounded shadow-sm p-3 mb-4">
                 <div className="d-flex items-align-center">

                   {isEditingTitle ? (
                    <input type="text"
                      className="form-control me-2"
                      autoFocus
                      onBlur={handleTitleBlur}
                      onChange={handleTitleChange}
                      value={invoiceTitle}

                    />
                   ):(
                     
                    <>
                    <h5 className="mb-0 me-2">{invoiceTitle}</h5>
                    <button
                     className="btn btn-sm p-0 border-0 bg-transparent"
                     onClick={handleTitleEdit}
                     >
                        <Pencil className="text-primary" size={20}/>
                    </button>
                    </>

                   )}
                   
                 </div>
                </div>

                {/* invoice-form and tamplate grid */}

                <div className="row g-4 alingn-items strech">
                    {/* invoice-form */}
                     <div className="col-12 col-lg-6 d-flex">

                        <div className="bg-white boder rounded shadow-sm p-4 w-100">
                           <InvoiceForm/>
                        </div>

                     </div>



                    {/* tamplate grid */}
                     <div className="col-12 col-lg-6 d-flex">

                         <div className="bg-white boder rounded shadow-sm p-4 w-100">
                           <TemplateGrid onTemplateClick={handleTemplateClick}/>
                         </div>
    
                     </div>


                </div>



            </div>

        </div>
    )
}

export default MainPage;