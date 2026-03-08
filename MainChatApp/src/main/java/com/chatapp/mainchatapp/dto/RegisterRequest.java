package com.chatapp.mainchatapp.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RegisterRequest {
    private String name;
    private String email;
    private String password;
    private String profilePicBase64; // optional — base64 image on signup
}