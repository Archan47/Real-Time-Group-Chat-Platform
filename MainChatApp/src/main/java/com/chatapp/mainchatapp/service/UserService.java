package com.chatapp.mainchatapp.service;

import com.chatapp.mainchatapp.dto.PasswordChangeRequest;
import com.chatapp.mainchatapp.dto.RegisterRequest;
import com.chatapp.mainchatapp.dto.RegisterResponse;
import com.chatapp.mainchatapp.entity.AppUser;
import com.chatapp.mainchatapp.entity.Role;
import com.chatapp.mainchatapp.repo.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
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

    public void changePassword(PasswordChangeRequest passwordChangeRequest) {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        String email = authentication.getName();

        AppUser user = userRepo.findByEmail(email);

        if (user == null){
            throw new RuntimeException("User not Found");
        }

        user.setPassword(passwordEncoder.encode(passwordChangeRequest.getNewPassWord()));
        user.setUpdatedAt(LocalDateTime.now());
        userRepo.save(user);

    }

    public void sendPasswordResetOtp(String email) {

        AppUser user = userRepo.findByEmail(email);

        if (user == null){
            throw new RuntimeException("User not found");
        }

        String otp = String.valueOf((int)(Math.random() * 900000) + 100000);

        user.setResetOtp(otp);
        user.setResetOtpExpireAt(LocalDateTime.now().plusMinutes(5));

        userRepo.save(user);

        emailService.sendPasswordResetOtpMail(email,otp);
    }




    public void verifyPasswordResetOtp(String email, String otp, String newPassword) {

        AppUser user = userRepo.findByEmail(email);

        if (user == null){
            throw new RuntimeException("User not found");
        }

        if (user.getResetOtp() == null || !user.getResetOtp().equals(otp)){
            throw new RuntimeException("Invalid OTP");
        }

        if (user.getResetOtpExpireAt().isBefore(LocalDateTime.now())){
            throw new RuntimeException("OTP expired");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        user.setResetOtp(null);
        user.setResetOtpExpireAt(null);
        user.setUpdatedAt(LocalDateTime.now());

        userRepo.save(user);
    }
}
