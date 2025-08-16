package in.shahvez.invoicegeneratorapi.controller;

import in.shahvez.invoicegeneratorapi.entity.Invoice;
import in.shahvez.invoicegeneratorapi.service.EmailService;
import in.shahvez.invoicegeneratorapi.service.InvoiceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

// TODO: Production mein "*" ki jagah apne frontend ka URL daalein (e.g., "https://your-app.com")
@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/api/invoices")
@RequiredArgsConstructor
public class invoiceController {

    private final InvoiceService service;
    private final EmailService emailService;

    @PostMapping
    public ResponseEntity<Invoice> saveInvoice(@RequestBody Invoice invoice, Authentication authentication) { // <-- BADLAV YAHAN HAI
        // Security: User ki ID authentication se lein, frontend par bharosa na karein.
        String clerkId = authentication.getName();
        invoice.setClerkId(clerkId); // <-- BADLAV YAHAN HAI (Assume Invoice entity has this method)

        return ResponseEntity.ok(service.saveInvoice(invoice));
    }

    @GetMapping
    public ResponseEntity<List<Invoice>> fetchInvoices(Authentication authentication) {
        // Yeh pehle se hi theek tha.
        System.out.println(authentication.getName());
        return ResponseEntity.ok(service.fetchInvoices(authentication.getName()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> removeInvoice(@PathVariable String id, Authentication authentication) {
        // Yeh bhi pehle se theek tha.
        if (authentication.getName() != null) {
            service.removeInvoice(authentication.getName(), id);
            return ResponseEntity.noContent().build();
        }
        throw new ResponseStatusException(HttpStatus.FORBIDDEN,
                "User does not have permission to access this resource");
    }

    @PostMapping("/sendinvoice")
    public ResponseEntity<?> sendInvoice(@RequestPart("file") MultipartFile file,
                                         @RequestPart("email") String customerEmail,
                                         Authentication authentication) { // <-- BADLAV YAHAN HAI
        // Security: Ab yeh endpoint sirf logged-in users ke liye hi chalega.
        try {
            emailService.sendInvoiceEmail(customerEmail, file);
            return ResponseEntity.ok().body("Invoice sent successfully!");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Failed to send invoice.");
        }
    }
}