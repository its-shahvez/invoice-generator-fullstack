import './Template5.css';

const Template5 = ({ data }) => {

    // FIX 1: Create a robust currency formatting function to safely format numbers.
    const formatCurrency = (amount) => {
        const numericAmount = Number(amount) || 0;
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 2,
        }).format(numericAmount);
    };

    // FIX 2: Safely calculate subtotal. Use `?.` and `|| []` to prevent errors if `data.items` is undefined.
    const subtotal = (data?.items || []).reduce((acc, item) => acc + (item.qty || 0) * (item.amount || 0), 0);
    const taxAmount = (subtotal * parseFloat(data?.tax || 0)) / 100;
    const total = subtotal + taxAmount;

    const formatDate = (dateString) => {
        // Add a guard for null or undefined dates
        if (!dateString) return 'N/A';
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return dateString; // Handle invalid date strings
            return date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
            });
        } catch (error) {
            return dateString;
        }
    };

    // FIX 3: Add a master guard clause. If `data` doesn't exist, render nothing to prevent any crashes.
    if (!data) {
        return null;
    }

    return (
        <div className="template5 mx-auto my-4 p-4 border rounded">
            {/* Header */}
            <div className="d-flex flex-column flex-md-row justify-content-between mb-4">
                <div>
                    {data?.companyLogo && (
                        <div className="mb-2">
                            <img
                                src={data.companyLogo}
                                alt="Company Logo"
                                width={98}
                            />
                        </div>
                    )}
                    {/* FIX 4: Use optional chaining (?.) for all data properties to avoid errors. */}
                    <h4 className="fw-bold">{data?.companyName}</h4>
                    <p className="mb-1">{data?.companyAddress}</p>
                    <p className="mb-0">{data?.companyPhone}</p>
                </div>
                <div className="text-md-end w-50">
                    <h5 className="fw-bold">INVOICE</h5>
                    <p className="mb-1"><strong>Invoice No:</strong> {data?.invoiceNumber}</p>
                    <p className="mb-1"><strong>Invoice Date:</strong> {formatDate(data?.invoiceDate)}</p>
                    <p className="mb-0"><strong>Due Date:</strong> {formatDate(data?.paymentDate)}</p>
                </div>
            </div>

            {/* Address Section */}
            <div className="row mb-4">
                <div className="col-md-6">
                    <h6 className="fw-bold">Bill To:</h6>
                    <p className="mb-1">{data?.billingName}</p>
                    <p className="mb-1">{data?.billingAddress}</p>
                    <p className="mb-0">{data?.billingPhone}</p>
                </div>
                {data?.shippingName && (
                    <div className="col-md-6 text-md-end">
                        <h6 className="fw-bold">Shipped To:</h6>
                        <p className="mb-1">{data.shippingName}</p>
                        <p className="mb-1">{data.shippingAddress}</p>
                        <p className="mb-0">{data.shippingPhone}</p>
                    </div>
                )}
            </div>

            {/* Items Table */}
            <div className="table-responsive mb-4">
                <table className="table mb-0">
                    <thead className="template5-table-head text-white table-light">
                        <tr>
                            <th className="p-3">Item # / Description</th>
                            <th className="p-3 text-center">Quantity</th>
                            <th className="p-3 text-center">Rate</th>
                            <th className="p-3 text-end">Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* FIX 5: Safely map over the items array. */}
                        {(data?.items || []).map((item, index) => (
                            <tr key={index} className="items-row">
                                <td className="p-3">
                                    <div className="fw-bold">{item?.name}</div>
                                    <div className="text-muted small">{item?.description}</div>
                                </td>
                                <td className="p-3 text-center">{item?.qty}</td>
                                {/* FIX 6: Use the robust formatCurrency function instead of .toFixed() */}
                                <td className="p-3 text-center">{formatCurrency(item?.amount)}</td>
                                <td className="p-3 text-end">{formatCurrency((item?.qty || 0) * (item?.amount || 0))}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Totals */}
            <div className="d-flex justify-content-end">
                <div style={{ width: '100%', maxWidth: '400px' }}>
                    <table className="table mb-0">
                        <tbody>
                            <tr>
                                <td><strong>Subtotal</strong></td>
                                <td className="text-end">{formatCurrency(subtotal)}</td>
                            </tr>
                            <tr>
                                <td><strong>Tax ({data?.tax || 0}%)</strong></td>
                                <td className="text-end">{formatCurrency(taxAmount)}</td>
                            </tr>
                            <tr>
                                <td><strong>Total</strong></td>
                                <td className="text-end fw-bold">{formatCurrency(total)}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Bank Account Details Section */}
            {(data?.accountName || data?.accountNumber || data?.accountIfscCode) && (
                <div className="mt-4">
                    <h6 className="mb-2 fw-semibold">Bank Account Details</h6>
                    {data.accountName && <p className="mb-1"><strong>Account Holder:</strong> {data.accountName}</p>}
                    {data.accountNumber && <p className="mb-1"><strong>Account Number:</strong> {data.accountNumber}</p>}
                    {data.accountIfscCode && <p className="mb-0"><strong>IFSC / Branch Code:</strong> {data.accountIfscCode}</p>}
                </div>
            )}

            {/* Notes */}
            {data?.notes && (
                <div className="mt-5">
                    <h6 className="fw-bold">Notes</h6>
                    <p className="mb-0">{data.notes}</p>
                </div>
            )}
        </div>
    );
};

export default Template5;