package com.chatapp.mainchatapp.controller;


import com.chatapp.mainchatapp.entity.User;
import com.chatapp.mainchatapp.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    public ResponseEntity<List<User>> getAllUsers(){
        return userService.geAllUsers();
    }

    public ResponseEntity<User> getUserByUserId(String userId){
        return userService.getUserByUserId(userId);
    }

}
