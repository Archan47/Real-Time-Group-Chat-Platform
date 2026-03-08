package com.chatapp.mainchatapp.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateProfileRequest {
    private String name;
    private String profilePicBase64; // base64 encoded image from frontend
}