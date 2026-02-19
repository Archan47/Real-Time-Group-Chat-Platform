package com.chatapp.mainchatapp.service;

import com.chatapp.mainchatapp.entity.User;
import com.chatapp.mainchatapp.repo.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;


@Service
public class AdminService {
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


    public ResponseEntity<User> getUser(String uId) {
        try{
            User user = userRepo.findById(uId)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            return new ResponseEntity<>(user,HttpStatus.OK);
        }
        catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }



    public void deleteUser(String uId) {
        if (!userRepo.existsById(uId)){
            throw new RuntimeException("User not found with id : " + uId);
        }
        userRepo.deleteById(uId);
    }

    public ResponseEntity<?> disableUser(String uId) {

        Optional<User> optionalUser = userRepo.findById(uId);

        if (optionalUser.isEmpty()){
            return new ResponseEntity<>("User not found",HttpStatus.NOT_FOUND);
        }

        User user = optionalUser.get();
        user.setEnabled(false);
        userRepo.save(user);

        return new ResponseEntity<>(user.getName() + ", you are disabled by Admin",HttpStatus.OK);
    }
}
