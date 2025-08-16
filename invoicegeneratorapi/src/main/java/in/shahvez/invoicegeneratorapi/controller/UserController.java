package in.shahvez.invoicegeneratorapi.controller;

import in.shahvez.invoicegeneratorapi.entity.User;
import in.shahvez.invoicegeneratorapi.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j; // <-- Naya import
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@Slf4j // <-- Naya Annotation
public class UserController {

    private final UserService userService;

    @GetMapping
    public ResponseEntity<User> getLoggedInUser(Authentication authentication) {
        if (authentication == null || authentication.getName() == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User is not authenticated");
        }
        String clerkId = authentication.getName();
        User user = userService.getAccountClerkId(clerkId);
        if (user == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found in database");
        }
        return ResponseEntity.ok(user);
    }

    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping
    public User createOrUpdateUser(@RequestBody User user, Authentication authentication){
        try{
            // === YAHAN BADLAV KIYA GAYA HAI ===
            log.info("Auth Token Clerk ID: {}", authentication.getName());
            log.info("Request Body Clerk ID: {}", user.getClerkId());

            if (!authentication.getName().equals(user.getClerkId())){
                log.error("PERMISSION DENIED: Token ID and Request Body ID do not match.");
                throw new ResponseStatusException(HttpStatus.FORBIDDEN,("user does not have permission to access resource"));
            }
            return  userService.saveOrUpdateUser(user);
        } catch (Exception e){
            log.error("Error in createOrUpdateUser: ", e);
            throw new RuntimeException(e);
        }
    }
}