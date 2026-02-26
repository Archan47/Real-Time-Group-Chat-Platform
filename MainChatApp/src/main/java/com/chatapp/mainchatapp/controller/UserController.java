package com.chatapp.mainchatapp.controller;

import com.chatapp.mainchatapp.dto.*;
import com.chatapp.mainchatapp.service.UserService;
import com.chatapp.mainchatapp.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.web.bind.annotation.*;


@RestController
@RequiredArgsConstructor
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;

    @PostMapping("/register")
    public ResponseEntity<RegisterResponse> register(@RequestBody RegisterRequest registerRequest){
        RegisterResponse registerResponse = userService.createProfile(registerRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(registerResponse);
    }

    @PutMapping("/change-password")
    public ResponseEntity<?> changePassword(@RequestBody PasswordChangeRequest passwordChangeRequest){
        userService.changePassword(passwordChangeRequest);
        return ResponseEntity.status(HttpStatus.OK).body("Password changed successfully");
    }


    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody ForgotPasswordRequest forgotPasswordRequest){
        userService.sendPasswordResetOtp(forgotPasswordRequest.getEmail());

        return ResponseEntity.status(HttpStatus.OK).body("OTP sent to your mail");
    }


    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyPasswordResetOtp(@RequestBody VerifyResetOtpRequest verifyResetOtpRequest){
        userService.verifyPasswordResetOtp(
                verifyResetOtpRequest.getEmail(),
                verifyResetOtpRequest.getOtp(),
                verifyResetOtpRequest.getNewPassword()
        );

        return ResponseEntity.status(HttpStatus.OK).body("Password reset successfully");
    }







}
