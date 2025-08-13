package in.shahvez.invoicegeneratorapi.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import in.shahvez.invoicegeneratorapi.entity.User;
import in.shahvez.invoicegeneratorapi.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("api/webhooks")
@RequiredArgsConstructor
public class ClerkwebhooController {

    @Value("${clerk.webhook.signing-secret}")
    private String webhookSecret;

    private final UserService userService;

    @PostMapping("/clerk")
    public ResponseEntity<?> handleClerkWebhook(@RequestHeader("svix-id") String svixId,
                                                @RequestHeader("svix-timestamp")String svixTimestamp,
                                                @RequestHeader("svix-signature") String svixSignature,
                                                @RequestBody String payload){
        try{
            verifyWebhokSignature(svixId,svixTimestamp,svixSignature,payload);
            ObjectMapper mapper = new ObjectMapper();
            JsonNode rootNote = mapper.readTree(payload);

            String  eventType = rootNote.path("type").asText();

            switch (eventType){
                case "user.created":
                    handleUserCreated(rootNote.path("data"));
                    break;
                case "user.updated":
                    handleUserUpdated(rootNote.path("data"));
                    break;

                case "user.deleted":
                    handleUserDeleted(rootNote.path("data"));
                    break;
            }
            return ResponseEntity.ok().build();


        }catch (Exception e){
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, e.getMessage());

        }

    }

    private void handleUserDeleted(JsonNode data) {
      String clerkId =  data.path("id").asText();
      userService.deleteAccount(clerkId);

    }

    private void handleUserUpdated(JsonNode data) {
        String clerkId = data.path("id").asText();
        User existingUser = userService.getAccountClerkId(clerkId);

        existingUser.setEmail(data.path("email_addresses").path(0).path("email_address").asText());
        existingUser.setFirstName(data.path("first_name").asText());
        existingUser.setLastName(data.path("last_name").asText());
        existingUser.setPhotoUrl(data.path("image_url").asText());

        userService.saveOrUpdateUser(existingUser);



    }

    private void handleUserCreated(JsonNode data) {
      User newUser =   User.builder()
                .clerkId(data.path("id").asText())
                .email(data.path("email_addresses").path(0).path("email_address").asText())
                .firstName(data.path("first_name").asText())
                .lastName(data.path("last_name").asText())
                .build();

        userService.saveOrUpdateUser(newUser);
    }

    private boolean verifyWebhokSignature(String svixId, String svixTimestamp, String svixSignature, String payload) {
    //TODO:VERIFY THE SIGNATURE
        return true;
    }
}
