package in.shahvez.invoicegeneratorapi.service;

import in.shahvez.invoicegeneratorapi.entity.User;
import in.shahvez.invoicegeneratorapi.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor

public class UserService {

    private final UserRepository userRepository;

    public User saveOrUpdateUser(User user){
       Optional<User> optionalUser =  userRepository.findByClerkId(user.getClerkId());

       if(optionalUser.isPresent()){
          User existingUser = optionalUser.get();
          existingUser.setEmail(user.getEmail());
          existingUser.setFirstName(user.getFirstName());
          existingUser.setLastName(user.getLastName());
          existingUser.setPhotoUrl(user.getPhotoUrl());
          existingUser = userRepository.save(existingUser);
           return existingUser;

       }
      return  userRepository.save(user);


    }

    public void deleteAccount(String clerkId){
      User existingUser =   userRepository.findByClerkId(clerkId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        userRepository.delete(existingUser);

    }
    public User getAccountClerkId(String clerkId){
       return  userRepository.findByClerkId(clerkId)
                .orElseThrow(() -> new RuntimeException("User not found"));

    }
}
