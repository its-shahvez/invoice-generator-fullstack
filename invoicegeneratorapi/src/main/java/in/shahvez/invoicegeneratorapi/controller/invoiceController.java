package in.shahvez.invoicegeneratorapi.controller;

import com.fasterxml.jackson.databind.ObjectMapper; // <-- Naya Import
import in.shahvez.invoicegeneratorapi.entity.Invoice;
import in.shahvez.invoicegeneratorapi.service.EmailService;
import in.shahvez.invoicegeneratorapi.service.InvoiceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.server.ResponseStatusException;


import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/invoices")
@Slf4j
public class invoiceController {

    private final InvoiceService invoiceService;
    private final EmailService emailService;

    // === YAHAN BADLAV KIYA GAYA HAI ===
    @PostMapping
    public ResponseEntity<Invoice> saveInvoice(@RequestBody String rawPayload){
        log.info(">>>>>> RAW INVOICE PAYLOAD RECEIVED: {}", rawPayload); // Hum raw data log kar rahe hain
        try {
            ObjectMapper mapper = new ObjectMapper();
            Invoice invoice = mapper.readValue(rawPayload, Invoice.class);
            return  ResponseEntity.ok(invoiceService.saveInvoice(invoice));
        } catch (Exception e) {
            log.error(">>>>>> FAILED TO PARSE INVOICE JSON: ", e);
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid invoice data format");
        }
    }

    @GetMapping
    public  ResponseEntity<List<Invoice>> fetchInvoices(Authentication authentication){
        return ResponseEntity.ok(invoiceService.fetchInvoices(authentication.getName()));
    }

    @DeleteMapping("/{id}")
    public  ResponseEntity<Void> invoiceRemove(@PathVariable  String id, Authentication authentication){
        if (authentication.getName() != null) {
            invoiceService.invoiceRemove(id, authentication.getName());
            return  ResponseEntity.noContent().build();
        }
        throw new ResponseStatusException(HttpStatus.FORBIDDEN,"userdoes not have permission to access resource");
    }

    @PostMapping("/sendinvoice")
    public  ResponseEntity<?> sendInvoice(@RequestParam("file") MultipartFile file,
                                          @RequestParam("email") String customerEmail)  {
        log.info("<<<<<<<<<< SEND INVOICE METHOD IS RUNNING! >>>>>>>>>>");
        try{
            emailService.sendInvoiceEmail(customerEmail,file);
            return ResponseEntity.ok().body("Email Sent Successfully");
        } catch(Exception e){
            log.error("ERROR sending email to: {}. Reason: {}", customerEmail, e.getMessage(), e);
            return  ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to Send Invoice");
        }
    }

    @GetMapping("/hello")
    public String sayHello() {
        log.info("<<<<<<<<<< HELLO METHOD IS WORKING! >>>>>>>>>>");
        return "Hello, World! The controller is working!";
    }
}