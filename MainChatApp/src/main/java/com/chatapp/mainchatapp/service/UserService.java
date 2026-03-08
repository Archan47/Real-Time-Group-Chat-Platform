package com.chatapp.mainchatapp.service;

import com.chatapp.mainchatapp.dto.PasswordChangeRequest;
import com.chatapp.mainchatapp.dto.RegisterRequest;
import com.chatapp.mainchatapp.dto.RegisterResponse;
import com.chatapp.mainchatapp.dto.UpdateProfileRequest;
import com.chatapp.mainchatapp.entity.AppUser;
import com.chatapp.mainchatapp.entity.Role;
import com.chatapp.mainchatapp.repo.UserRepo;
import com.chatapp.mainchatapp.util.JwtUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class UserService {

    private static final Logger logger = LoggerFactory.getLogger(UserService.class);

    @Autowired private UserRepo userRepo;
    @Autowired private PasswordEncoder passwordEncoder;
    @Autowired private EmailService emailService;
    @Autowired private JwtUtil jwtUtil;

    public RegisterResponse createProfile(RegisterRequest req) {
        if (userRepo.findByEmail(req.getEmail()) != null) {
            throw new RuntimeException("Email already exists!");
        }

        AppUser user = new AppUser();
        user.setName(req.getName());
        user.setEmail(req.getEmail());
        user.setPassword(passwordEncoder.encode(req.getPassword()));
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());
        user.setAccountVerified(false);
        user.setEnabled(true);
        user.setRole(Role.USER);

        if (req.getProfilePicBase64() != null && !req.getProfilePicBase64().isBlank()) {
            user.setProfilePicUrl(req.getProfilePicBase64());
        }

        AppUser saved = userRepo.save(user);

        try {
            emailService.sendRegistrationMail(saved.getEmail(), saved.getName());
        } catch (Exception e) {
            logger.warn("Registration email failed for {}: {}", saved.getEmail(), e.getMessage());
        }

        // Generate tokens directly — same methods used in AuthController
        String accessToken  = jwtUtil.generateToken(saved.getEmail(), saved.getRole().name());
        String refreshToken = jwtUtil.generateRefreshToken(saved.getEmail(), UUID.randomUUID().toString());

        return RegisterResponse.builder()
                .uId(saved.getId())
                .name(saved.getName())
                .email(saved.getEmail())
                .isAccountVerified(saved.isAccountVerified())
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .build();
    }

    public AppUser getByEmail(String email) {
        AppUser user = userRepo.findByEmail(email);
        if (user == null) throw new RuntimeException("User not found");
        return user;
    }

    public void updateProfile(String email, UpdateProfileRequest req) {
        AppUser user = userRepo.findByEmail(email);
        if (user == null) throw new RuntimeException("User not found");
        if (req.getName() != null && !req.getName().isBlank()) {
            user.setName(req.getName());
        }
        if (req.getProfilePicBase64() != null && !req.getProfilePicBase64().isBlank()) {
            user.setProfilePicUrl(req.getProfilePicBase64());
        }
        user.setUpdatedAt(LocalDateTime.now());
        userRepo.save(user);
    }

    public void changePassword(PasswordChangeRequest req) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        AppUser user = userRepo.findByEmail(auth.getName());
        if (user == null) throw new RuntimeException("User not found");
        user.setPassword(passwordEncoder.encode(req.getNewPassWord()));
        user.setUpdatedAt(LocalDateTime.now());
        userRepo.save(user);
    }

    public void sendPasswordResetOtp(String email) {
        AppUser user = userRepo.findByEmail(email);
        if (user == null) throw new RuntimeException("User not found");
        String otp = String.valueOf((int)(Math.random() * 900000) + 100000);
        user.setResetOtp(otp);
        user.setResetOtpExpireAt(LocalDateTime.now().plusMinutes(5));
        userRepo.save(user);
        try {
            emailService.sendPasswordResetOtpMail(email, otp);
        } catch (Exception e) {
            logger.warn("OTP email failed: {}", e.getMessage());
        }
    }

    public void verifyPasswordResetOtp(String email, String otp, String newPassword) {
        AppUser user = userRepo.findByEmail(email);
        if (user == null) throw new RuntimeException("User not found");
        if (user.getResetOtp() == null || !user.getResetOtp().equals(otp))
            throw new RuntimeException("Invalid OTP");
        if (user.getResetOtpExpireAt().isBefore(LocalDateTime.now()))
            throw new RuntimeException("OTP expired");
        user.setPassword(passwordEncoder.encode(newPassword));
        user.setResetOtp(null);
        user.setResetOtpExpireAt(null);
        user.setUpdatedAt(LocalDateTime.now());
        userRepo.save(user);
    }
}