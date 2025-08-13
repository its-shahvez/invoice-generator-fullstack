import './Template4.css';

const Template4 = ({ data }) => {

    
    const formatCurrency = (amount) => {
        const numericAmount = Number(amount) || 0;
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 2
        }).format(numericAmount);
    };

    // 
    const subtotal = (data?.items || []).reduce((acc, item) => acc + (item.qty || 0) * (item.amount || 0), 0);
    const taxAmount = (subtotal * parseFloat(data?.tax || 0)) / 100;
    const total = subtotal + taxAmount;

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return dateString;
            return date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
            });
        } catch (error) {
            return dateString;
        }
    };

    // 
    if (!data) {
        return null;
    }

    return (
        <div className="template4 border rounded mx-auto my-4 p-4">
            {/* Header */}
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-start mb-4">
                <div className="w-50">
                    {data?.companyLogo && (
                        <div className="mb-2">
                            <img
                                src={data.companyLogo}
                                alt="Company Logo"
                                width={98}
                            />
                        </div>
                    )}
                    
                    <h4 className="template4-company-name">{data?.companyName}</h4>
                    <p className="mb-1">{data?.companyAddress}</p>
                    <p className="mb-0">{data?.companyPhone}</p>
                </div>
                <div className="text-md-end w-50">
                    <h5 className="template4-title template4-primary-color">Invoice</h5>
                    <p className="mb-1"><strong>Invoice No:</strong> {data?.invoiceNumber}</p>
                    <p className="mb-1"><strong>Invoice Date:</strong> {formatDate(data?.invoiceDate)}</p>
                    <p className="mb-0"><strong>Due Date:</strong> {formatDate(data?.paymentDate)}</p>
                </div>
            </div>

            {/* Billing */}
            <div className="mb-4 w-50">
                <h6 className="fw-bold template4-primary-color">Billed to</h6>
                <p className="mb-1">{data?.billingName}</p>
                <p className="mb-1">{data?.billingAddress}</p>
                <p className="mb-0">{data?.billingPhone}</p>
            </div>

            {/* Items Table */}
            <div className="table-responsive mb-4">
                <table className="table table-bordered mb-0">
                    <thead className="template4-table-head text-white">
                        <tr>
                            <th className="p-3 template4-table-head">Item #/Item description</th>
                            <th className="p-3 text-center template4-table-head">Quantity</th>
                            <th className="p-3 text-center template4-table-head">Rate</th>
                            <th className="p-3 text-end template4-table-head">Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        
                        {(data?.items || []).map((item, index) => (
                            <tr key={index}>
                                <td className="p-3">
                                    <div className="fw-bold">{item?.name}</div>
                                    <div className="text-muted">{item?.description}</div>
                                </td>
                                <td className="p-3 text-center">{item?.qty}</td>
                                
                                <td className="p-3 text-center">{formatCurrency(item?.amount)}</td>
                                <td className="p-3 text-end">{formatCurrency((item?.qty || 0) * (item?.amount || 0))}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Totals Table */}
            <div className="d-flex justify-content-end">
                <div style={{ width: '100%', maxWidth: '400px' }}>
                    <table className="table table-bordered mb-0">
                        <tbody>
                            <tr>
                                <td><strong>Sub Total</strong></td>
                                <td className="text-end">{formatCurrency(subtotal)}</td>
                            </tr>
                            <tr>
                                <td><strong>Tax ({data?.tax || 0}%)</strong></td>
                                <td className="text-end">{formatCurrency(taxAmount)}</td>
                            </tr>
                            <tr>
                                <td className="fw-bold template4-table-head"><strong>Total Due Amount</strong></td>
                                <td className="text-end fw-bold template4-table-head">{formatCurrency(total)}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Bank Account Details Section */}
            {(data?.accountName || data?.accountNumber || data?.accountIfscCode) && (
                <div className="mt-4">
                    <h6 className="mb-2 template4-primary-color fw-semibold">Bank Account Details</h6>
                    {data.accountName && <p className="mb-1"><strong>Account Holder:</strong> {data.accountName}</p>}
                    {data.accountNumber && <p className="mb-1"><strong>Account Number:</strong> {data.accountNumber}</p>}
                    {data.accountIfscCode && <p className="mb-0"><strong>IFSC / Branch Code:</strong> {data.accountIfscCode}</p>}
                </div>
            )}

            {/* Footer */}
            {data?.notes && (
                <div className="text-center mt-5">
                    <p className="mb-0">{data.notes}</p>
                </div>
            )}
        </div>
    );
};

export default Template4;