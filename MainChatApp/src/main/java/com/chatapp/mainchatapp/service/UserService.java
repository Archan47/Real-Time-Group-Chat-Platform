package com.chatapp.mainchatapp.service;

import com.chatapp.mainchatapp.entity.User;
import com.chatapp.mainchatapp.repo.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.ArrayList;
import java.util.List;

public class UserService {

    public ResponseEntity<User> getUserByUserId;
    @Autowired
    private UserRepo userRepo;

    public ResponseEntity<List<User>> geAllUsers() {
        try{
            return new ResponseEntity<>(userRepo.findAll(), HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
        }

        return new ResponseEntity<>(new ArrayList<>(),HttpStatus.BAD_REQUEST);
    }


    public ResponseEntity<User> getUserByUserId(String userId) {

        try{
            return new ResponseEntity<>(userRepo.findByUserId(userId),HttpStatus.OK);
        } catch (RuntimeException e) {
            e.printStackTrace();
        }
        return new ResponseEntity<>(new User(),HttpStatus.BAD_REQUEST);
    }
}
