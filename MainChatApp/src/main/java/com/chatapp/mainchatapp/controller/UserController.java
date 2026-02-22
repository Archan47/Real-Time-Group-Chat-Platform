package com.chatapp.mainchatapp.controller;


import com.chatapp.mainchatapp.dto.RegisterRequest;
import com.chatapp.mainchatapp.dto.RegisterResponse;
import com.chatapp.mainchatapp.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/register")

    public ResponseEntity<RegisterResponse> register(@RequestBody RegisterRequest registerRequest){
        RegisterResponse registerResponse = userService.createProfile(registerRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(registerResponse);
    }
}
