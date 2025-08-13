import './Template3.css';

const Template3 = ({ data }) => {

    // FIX 1: Use a robust currency formatting function like in Template2
    const formatCurrency = (amount) => {
        // Provide a fallback for amount to prevent errors
        const numericAmount = Number(amount) || 0;
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR', // You can make this dynamic if needed e.g., data?.currency || 'INR'
            minimumFractionDigits: 2
        }).format(numericAmount);
    };

    // FIX 2: Safely calculate subtotal, defaulting to an empty array if items don't exist
    const subtotal = (data?.items || []).reduce((acc, item) => acc + (item.qty || 0) * (item.amount || 0), 0);
    const taxAmount = (subtotal * parseFloat(data?.tax || 0)) / 100;
    const total = subtotal + taxAmount;

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A'; // Handle empty date string
        try {
            const date = new Date(dateString);
            // Check if date is valid
            if (isNaN(date.getTime())) {
                return dateString;
            }
            return date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
            });
        } catch (error) {
            return dateString; // Return original string if there's an error
        }
    };

    // If there's no data, don't render anything to avoid crashes
    if (!data) {
        return null;
    }

    return (
        <div className="template3 border rounded mx-auto my-4 px-2 px-sm-4 py-3 template3-container">
            {/* Header Section */}
            <div className="d-flex flex-column flex-md-row justify-content-between mb-4">
                <div className="w-100 w-md-50 mb-3 mb-md-0">
                    <h1 className="template3-heading">Invoice</h1>
                    {/* FIX 3: Use optional chaining for all data properties */}
                    <p className="mb-1"><strong>Invoice#:</strong> {data?.invoiceNumber}</p>
                    <p className="mb-1"><strong>Invoice Date:</strong> {formatDate(data?.invoiceDate)}</p>
                    <p className="mb-1"><strong>Due Date:</strong> {formatDate(data?.paymentDate)}</p>
                </div>
                <div className="text-md-end w-100 w-md-50">
                    {data?.companyLogo && (
                        <div className="mb-2">
                            <img
                                src={data.companyLogo}
                                alt="Company Logo"
                                width={98}
                            />
                        </div>
                    )}
                    <h2 className="h5 company-title">{data?.companyName}</h2>
                    <p className="mb-1">{data?.companyAddress}</p>
                    <p className="mb-1">{data?.companyPhone}</p>
                </div>
            </div>

            {/* Billing Information Section */}
            <div className="d-flex flex-column flex-md-row gap-3 mb-4">
                {data?.shippingName && (
                    <div className="p-3 rounded w-100 w-md-50 template3-bill-box">
                        <h5 className="template3-subheading">Shipped To</h5>
                        <p className="mb-1">{data.shippingName}</p>
                        <p className="mb-1">{data.shippingAddress}</p>
                        <p className="mb-1">{data.shippingPhone}</p>
                    </div>
                )}
                <div className="p-3 rounded w-100 w-md-50 template3-bill-box">
                    <h5 className="template3-subheading">Billed to</h5>
                    <p className="mb-1">{data?.billingName}</p>
                    <p className="mb-1">{data?.billingAddress}</p>
                    <p className="mb-1">{data?.billingPhone}</p>
                </div>
            </div>

            {/* Invoice Items Table */}
            <div className="table-responsive mb-4">
                <table className="table table-bordered mb-0">
                    <thead>
                        <tr>
                            <th className="p-3 template3-table-header">Item #/Description</th>
                            <th className="p-3 text-center template3-table-header">Qty.</th>
                            <th className="p-3 text-center template3-table-header">Rate</th>
                            <th className="p-3 text-end template3-table-header">Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* FIX 4: Safely map over items */}
                        {(data?.items || []).map((item, index) => (
                            <tr key={index}>
                                <td className="p-3">
                                    <div className="fw-bold">{index + 1}. {item?.name}</div>
                                    <div className="text-muted">{item?.description}</div>
                                </td>
                                <td className="p-3 text-center">{item?.qty}</td>
                                {/* FIX 5: Use the new formatCurrency function */}
                                <td className="p-3 text-center">{formatCurrency(item?.amount)}</td>
                                <td className="p-3 text-end">{formatCurrency((item?.qty || 0) * (item?.amount || 0))}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Totals Section */}
            <div className="d-flex justify-content-end mb-4">
                <div className="template3-total-box">
                    <div className="d-flex justify-content-between mb-2">
                        <span>Sub Total:</span>
                        <span>{formatCurrency(subtotal)}</span>
                    </div>
                    <div className="d-flex justify-content-between mb-2">
                        <span>Tax ({data?.tax || 0}%):</span>
                        <span>{formatCurrency(taxAmount)}</span>
                    </div>
                    <div className="d-flex justify-content-between fw-bold template3-total">
                        <span>Total:</span>
                        <span>{formatCurrency(total)}</span>
                    </div>
                </div>
            </div>

            {/* Bank Account Details Section */}
            {(data?.accountName || data?.accountNumber || data?.accountIfscCode) && (
                <div className="mt-4">
                    <h6 className="mb-2 template3-subheading fw-semibold">Bank Account Details</h6>
                    <p className="mb-1"><strong>Account Holder:</strong> {data.accountName}</p>
                    <p className="mb-1"><strong>Account Number:</strong> {data.accountNumber}</p>
                    <p className="mb-0"><strong>IFSC / Branch Code:</strong> {data.accountIfscCode}</p>
                </div>
            )}

            {/* Notes Section */}
            {data?.notes && (
                <div className="pt-3 border-top mt-4">
                    <h5 className="template3-subheading">Note</h5>
                    <p>{data.notes}</p>
                </div>
            )}
        </div>
    );
};

export default Template3;