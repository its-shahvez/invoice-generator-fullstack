import { Trash2 } from "lucide-react";
import { assets } from "../assets/assets.js";
import { AppContext } from "../context/AppContext.jsx";
import { useContext, useEffect } from "react";

const InvoiceForm = () =>{
    const {invoiceData, setInvoiceData}  =useContext(AppContext)

    const addItem = () =>{
        setInvoiceData((prev) =>({
            ...prev,
            items:[
                ...prev.items,
                {name:"", qty:"",amount:"", description:"", total:0},
            ]
        }))
    }

    const deleteItem = (index) =>{
        const items =invoiceData.items.filter((_, i) => i != index);
        setInvoiceData((prev) => ({...prev, items}));
    }

    const handleChange = (section, feild, value) =>{
        setInvoiceData((prev) => ({
            ...prev,
            [section]: {...prev[section], [feild]:value}
        }));
    }

    const sameASHandleBilling = () =>{
        setInvoiceData((prev) => ({
            ...prev,
            shipping:{...prev.billing}
        }))
    }

    const handleItemChange = (index, field, value) =>{
        const items = [...invoiceData.items];
        items[index][field] = value;
        if( field ==="qty" || field==="amount"){
            items[index].total = (items[index].qty || 0)*(items[index].amount || 0)

        }
        setInvoiceData((prev) => ({...prev, items}));
    }

    const calculateTotals = () =>{
         const subtotal = invoiceData.items.reduce((sum, item) => sum+ (item.total || 0) , 0)
         const taxRate = Number(invoiceData.tax || 0);
         const taxAmount = (subtotal * taxRate)/100;
         const grandTotal = subtotal+taxAmount;

         return{subtotal, taxAmount, grandTotal};

    }

    const {subtotal, taxAmount,grandTotal} = calculateTotals();


    const handleLogoUpload = (e) =>{
        const file = e.target.files[0]
        if(file){
            const reader = new FileReader()
            reader.onloadend =() => {
                setInvoiceData((prev) =>({
                    ...prev,
                    logo:reader.result
                }))

            };
            reader.readAsDataURL(file);
        }
    }

    useEffect( () =>{
        if(!invoiceData.invoice.number){
          const randomNumber=  `INV-${Math.floor(100000+ Math.random() * 900000)}`;
          setInvoiceData((prev) =>({
            ...prev,
            invoice:{...prev.invoice, number:randomNumber},
          }))
        }
    },[]);


    return(
        <div className="invoiceForm conatiner py-4">
            {/* comapny logo */}
            <div className="mb-4">
                <h5>Comapny Logo</h5>
                <div className="d-flex align-items-center gap-3">
                    <label htmlFor="image" className="form-label">
                        <img src={invoiceData.logo ? invoiceData.logo:assets.upload_area} alt="upload" width={98} />    
                    </label>
                    <input type="file"
                     name="logo" 
                     id="image"
                     hidden className="form-control"
                     accept="image/*"
                     onChange={handleLogoUpload}
                       
                       />
                </div>
            </div>

              {/* comapny info */}
            <div className="mb-4">
                <h5>Your Company</h5>
                <div className="row g-3">
                    <div className="col-md-6">
                        <input type="text" 
                        className="form-control" 
                        placeholder="Company Name"
                        onChange={(e) => handleChange("company", "name", e.target.value)}
                         value={invoiceData.company.name}
                        />
                    </div>
                    <div className="col-md-6">
                        <input type="text"
                         className="form-control"
                        placeholder="Company phone" 
                         onChange={(e) => handleChange("company", "phone", e.target.value)}
                         value={invoiceData.company.phone}
                          
                          />
                    </div>
                    <div className="col-md-12">
                      <input type="text" 
                      className="form-control"
                       placeholder="Company address"
                       onChange={(e) => handleChange("company", "address", e.target.value)}
                       value={invoiceData.company.address}
                       />
                    </div>
                </div>
            </div>

              {/* Billing section*/}
            <div className="mb-4">
               <h5>Bill To</h5>
                <div className="row g-3">
                   <div className="col-md-6">
                      <input type="text" 
                      className="form-control" 
                      placeholder="Name" 
                      onChange={(e) => handleChange("billing", "name", e.target.value)}
                      value={invoiceData.billing.name}
                      
                      />
                   </div>
                  <div className="col-md-6">
                       <input type="text"
                        className="form-control"
                         placeholder="Phone Number"
                         onChange={(e) => handleChange("billing", "phone", e.target.value)}
                         value={invoiceData.billing.phone}
                         />
                   </div>
                  <div className="col-md-12">
                     <input type="text"
                      className="form-control"
                       placeholder="Address"
                       onChange={(e) => handleChange("billing", "address", e.target.value)}
                       value={invoiceData.billing.address}
                       />
                   </div>
                </div>

            </div>

              {/* ship to*/}
            <div className="mb-4">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <h5>Ship To</h5>
                   <div className="form-check">
                      <input type="checkbox" className="form-check-input" id="sameAsBilling" onChange={sameASHandleBilling} />
                       <label htmlFor="sameAsBilling" className="form-check-label">
                          Same As Billing
                       </label>
                    </div>
              </div>
                <div className="row g-3">
                  <div className="col-md-6">
                     <input type="text"
                      className="form-control"
                      placeholder="Name" 
                      onChange={(e) => handleChange("shipping", "name", e.target.value)}
                      value={invoiceData.shipping.name}
                       />
                  </div>
                  <div className="col-md-6">
                      <input type="text"
                        className="form-control"
                        placeholder="Phone Number"
                        onChange={(e) => handleChange("shipping", "phone", e.target.value)}
                        value={invoiceData.shipping.phone}
                        />
                   </div>
                   <div className="col-md-12">
                        <input type="text" 
                        className="form-control" 
                        placeholder="Shipping  Address"
                         onChange={(e) => handleChange("shipping", "address", e.target.value)}
                         value={invoiceData.shipping.address}
                        />
                   </div>
                </div>
            </div>


              {/*invoice info */}
            <div className="mb-4">
              <h5>Invoice Information</h5>
                <div className="row g-3">
                    <div className="col-md-4">
                      <lable   htmlFor="invoiceNumber" className="form-label">Invoice Number</lable>
                      <input type="text" 
                       disabled className="form-control"
                        id="invoiceNumber"
                        onChange={(e) => handleChange("invoice", "number", e.target.value)}
                        value={invoiceData.invoice.number}
                        />
                    </div>
                    <div className="col-md-4">
                      <lable  htmlFor="invoiceDate" className="form-label">Invoice Date</lable>
                      <input type="date"
                       className="form-control"
                        id="invoiceDate"
                         onChange={(e) => handleChange("invoice", "date", e.target.value)}
                         value={invoiceData.invoice.date}
                        />
                   </div>
                    <div className="col-md-4">
                      <lable   htmlFor="invoiceDueDate" className="form-label">Invoice Due Date</lable>
                      <input type="date" 
                      className="form-control"  
                      id="invoiceDueDate"
                       onChange={(e) => handleChange("invoice", "dueDate", e.target.value)}
                       value={invoiceData.invoice.dueDate}
                      
                      />
                    </div>
                </div>
            </div>

              {/*Item details */}
            <div className="mb-4">
                <h5>Item Details</h5>
                 {invoiceData.items.map((item,index) => (

                <div key={index} className="card p-3 mb-3">
                    <div className="row g-3 mb-2">
                      <div className="col-md-3">
                         <input type="text"
                          className="form-control"
                           placeholder="Item Name"
                           value={item.name}
                           onChange={(e) => handleItemChange(index, "name", e.target.value)}
                           />
                      </div>
                     <div className="col-md-3">
                          <input type="number"
                           className="form-control"
                            placeholder="qty"
                             value={item.qty}
                             onChange={(e) => handleItemChange(index, "qty", e.target.value)}
                            />
                      </div>
                      <div className="col-md-3">
                            <input type="number"
                             className="form-control"
                              placeholder="Amount"
                               value={item.amount}
                               onChange={(e) => handleItemChange(index, "amount", e.target.value)}
                              />
                      </div>
                       <div className="col-md-3">
                          <input type="number" 
                          className="form-control"
                           placeholder="Total"
                            value={item.total}
                             disabled
                           />
                        </div>
                   </div>
                    <div className="d-flex gap-2">
                         <textarea  className="form-control" 
                         placeholder="Description"
                         value={item.description}
                        onChange={(e) => handleItemChange(index, "description", e.target.value)}
                         ></textarea>
                         {invoiceData.items.length>1 &&(
                        <button className="btn btn-outline-danger" type="button" onClick={() =>  deleteItem(index)}>
                          <Trash2 size={18}/>
                        </button>
                        )}
                   </div>
                </div>))}

                <button className="btn btn-primary" type="button" onClick={addItem}>Add Item</button>
            </div>

              {/* bank account info */}
            <div className="mb-4">
               <h5>Bank Account Details</h5>
                <div className="row g-3">
                    <div className="col-md-4">
                        <input type="text"  
                         className="form-control"
                          placeholder="Account Holder Name"
                          value={invoiceData.account.name}
                          onChange={(e) => handleChange("account", "name", e.target.value)}
                          
                          />
                     </div>
                    <div className="col-md-4">
                        <input type="text"
                         className="form-control" 
                         placeholder="Account Number" 
                         value={invoiceData.account.number}
                         onChange={(e) => handleChange("account", "number", e.target.value)}
                         
                         />
                    </div>
                      <div className="col-md-4">
                        <input type="text" 
                        className="form-control"
                         placeholder="Branch/IFSC Code"
                         value={invoiceData.account.ifsccode}
                        onChange={(e) => handleChange("account", "ifsccode", e.target.value)}
                         
                         />
                    </div>
                </div>
            </div>

              {/* total */}
            <div className="mb-4">
                <h5>Totals</h5>
                <div className="d-flex justify-content-end">
                    <div className="w-100 w-md-50">
                        <div className="d-flex justify-content-between">
                            <span>Subtotal</span>
                            <span>₹{subtotal.toFixed(2)}</span>
                        </div>
                        <div className="d-flex justify-content-between align-items-center my-2">
                            <label htmlFor="taxInput" className="me-2">Tax Rate(%)</label>
                            <input type="number" id="taxInput"
                             className="form-control w-50 text-end"
                              placeholder="2"
                              value={invoiceData.tax}
                              onChange={(e) => setInvoiceData((prev) => ({...prev, tax: e.target.value}))}
                              />

                        </div>
                        <div className="d-flex justify-content-between">
                            <span>Tax Amount</span>
                            <span>₹{taxAmount.toFixed(2)}</span>
                        </div>
                        <div className="d-flex justify-content-between fw-bold mt-2">
                            <span>Grand Total</span>
                            <span>₹{grandTotal.toFixed(2)}</span>

                        </div>
                    </div>

                </div>
            </div>

              {/* notes */}
             <div className="mb-4">
                <h5>Notes:</h5>
                <div className="w-100">
                    <textarea name="notes" 
                    className="form-control "
                     rows={3}
                     value={invoiceData.notes}
                     onChange={(e) => setInvoiceData((prev) => ({...prev, notes:e.target.value}))}
                     
                     ></textarea>
                </div>
             </div>
             
             

        </div>
    )
}
export default InvoiceForm;