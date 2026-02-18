package com.chatapp.mainchatapp.service;

import com.chatapp.mainchatapp.dto.RegisterRequest;
import com.chatapp.mainchatapp.dto.RegisterResponse;
import com.chatapp.mainchatapp.entity.Role;
import com.chatapp.mainchatapp.entity.User;
import com.chatapp.mainchatapp.repo.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class UserService {

    @Autowired
    private UserRepo userRepo;


    public RegisterResponse createProfile(RegisterRequest registerRequest){

            if (userRepo.findByEmail(registerRequest.getEmail()) != null){
                throw new RuntimeException("Email Already exists !!");
            }

            User newUser = new User();
            newUser.setName(registerRequest.getName());
            newUser.setEmail(registerRequest.getEmail());
            newUser.setPassword(registerRequest.getPassword());
            newUser.setCreatedAt(LocalDateTime.now());
            newUser.setUpdatedAt(LocalDateTime.now());
            newUser.setAccountVerified(false);
            newUser.setVerifyOtp(null);
            newUser.setResetOtp(null);
            newUser.setVerifyOtpExpireAt(null);
            newUser.setResetOtpExpireAt(null);
            newUser.setEnabled(true);
            newUser.setRole(Role.USER);

            User saveUser = userRepo.save(newUser);

            return RegisterResponse.builder()
                    .uId(saveUser.getId())
                    .name(saveUser.getName())
                    .email(saveUser.getEmail())
                    .isAccountVerified(saveUser.isAccountVerified())
                    .build();
    }
}
