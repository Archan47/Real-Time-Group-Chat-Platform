package com.chatapp.mainchatapp.service;

import com.chatapp.mainchatapp.dto.RegisterRequest;
import com.chatapp.mainchatapp.dto.RegisterResponse;
import com.chatapp.mainchatapp.entity.AppUser;
import com.chatapp.mainchatapp.entity.Role;
import com.chatapp.mainchatapp.repo.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class UserService {

    @Autowired
    private UserRepo userRepo;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private EmailService emailService;


    public RegisterResponse createProfile(RegisterRequest registerRequest){

            if (userRepo.findByEmail(registerRequest.getEmail()) != null){
                throw new RuntimeException("Email Already exists !!");
            }

            AppUser newAppUser = new AppUser();
            newAppUser.setName(registerRequest.getName());
            newAppUser.setEmail(registerRequest.getEmail());
            newAppUser.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
            newAppUser.setCreatedAt(LocalDateTime.now());
            newAppUser.setUpdatedAt(LocalDateTime.now());
            newAppUser.setAccountVerified(false);
            newAppUser.setVerifyOtp(null);
            newAppUser.setResetOtp(null);
            newAppUser.setVerifyOtpExpireAt(null);
            newAppUser.setResetOtpExpireAt(null);
            newAppUser.setEnabled(true);
            newAppUser.setRole(Role.USER);

            AppUser saveAppUser = userRepo.save(newAppUser);

            emailService.sendRegistrationMail(
                    saveAppUser.getEmail(),
                    saveAppUser.getName()
            );

            return RegisterResponse.builder()
                    .uId(saveAppUser.getId())
                    .name(saveAppUser.getName())
                    .email(saveAppUser.getEmail())
                    .isAccountVerified(saveAppUser.isAccountVerified())
                    .build();
    }
}
