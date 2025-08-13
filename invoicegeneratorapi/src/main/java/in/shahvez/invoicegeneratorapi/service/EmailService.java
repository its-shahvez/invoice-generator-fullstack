package in.shahvez.invoicegeneratorapi.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    // THIS IS THE CORRECTED LINE. THIS WILL FIX YOUR APPLICATION.
    @Value("${spring.mail.username}")
    private String fromEmail;

    public void sendInvoiceEmail(String toEmail, MultipartFile file) throws MessagingException, IOException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true);

        helper.setFrom(fromEmail);
        helper.setTo(toEmail);
        helper.setSubject("Your Invoice from QuickInvoice");
        helper.setText("Dear Customer, \n\nPlease find your invoice attached.\n\nThank you for your business!");

        String fileName = file.getOriginalFilename() != null ? file.getOriginalFilename() : "invoice.pdf";
        helper.addAttachment(fileName, new ByteArrayResource(file.getBytes()));

        mailSender.send(message);
    }
}