package in.shahvez.invoicegeneratorapi.controller;

import in.shahvez.invoicegeneratorapi.entity.User;
import in.shahvez.invoicegeneratorapi.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity; // <-- Yeh import add kiya hai
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    /**
     * Yeh naya method hai jo login hue user ki details database se fetch karega.
     * Frontend isey call karke user ka data lega.
     */
    @GetMapping
    public ResponseEntity<User> getLoggedInUser(Authentication authentication) {
        if (authentication == null || authentication.getName() == null) {
            // Agar user authenticated nahi hai to error bhejein
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User is not authenticated");
        }
        String clerkId = authentication.getName();
        User user = userService.getAccountClerkId(clerkId);
        if (user == null) {
            // Agar user database mein nahi milta hai to error bhejein
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found in database");
        }
        // Agar user mil jaata hai to uski details bhej dein
        return ResponseEntity.ok(user);
    }

    /**
     * Yeh aapka pehle se likha hua method hai jo user ko create ya update karta hai.
     */
    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping
    public User createOrUpdateUser(@RequestBody User user, Authentication authentication){
        try{
            if (!authentication.getName().equals(user.getClerkId())){
                throw new ResponseStatusException(HttpStatus.FORBIDDEN,("user does not have permission to access resource"));
            }
            return  userService.saveOrUpdateUser(user);
        } catch (Exception e){
            throw new RuntimeException(e);
        }
    }
}