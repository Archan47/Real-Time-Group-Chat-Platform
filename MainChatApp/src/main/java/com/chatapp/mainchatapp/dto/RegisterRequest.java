package com.chatapp.mainchatapp.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@AllArgsConstructor
@NoArgsConstructor
public class RegisterRequest {

    @NotBlank(message = "Name should not be empty")
    private String name;
    @Email(message = "Please enter valid email")
    @NotNull(message = "Email should not be empty")
    private String email;
    @Size(min = 6, message = "Password must be with in 6 characters")
    private String password;
}
