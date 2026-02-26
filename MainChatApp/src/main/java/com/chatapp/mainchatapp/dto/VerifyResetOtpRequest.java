package com.chatapp.mainchatapp.dto;


import lombok.Data;

@Data
public class VerifyResetOtpRequest {
    private String email;
    private String otp;
    private String newPassword;
}
