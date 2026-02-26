package com.chatapp.mainchatapp.dto;

import lombok.Data;

@Data
public class PasswordChangeRequest {
    private String oldPassword;
    private String newPassWord;
}
