package in.shahvez.invoicegeneratorapi.service;


import in.shahvez.invoicegeneratorapi.entity.Invoice;
import in.shahvez.invoicegeneratorapi.repository.InvoiceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class InvoiceService {

    private final InvoiceRepository invoiceRepository;

    public Invoice saveInvoice(Invoice invoice){

        return   invoiceRepository.save(invoice);
    }


    public List<Invoice> fetchInvoices(String clerkId){
        return invoiceRepository.findByClerkId(clerkId);
    }

    public void invoiceRemove(String invoiceId,String clerkId){
        Invoice existingInvoice = invoiceRepository.findByClerkIdAndId(clerkId,invoiceId)
                 .orElseThrow(() -> new RuntimeException("Invoice Not Found:"+ invoiceId));

        invoiceRepository.delete(existingInvoice);
    }




}
