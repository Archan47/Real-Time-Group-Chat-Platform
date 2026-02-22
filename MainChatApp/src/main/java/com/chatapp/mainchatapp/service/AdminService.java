package com.chatapp.mainchatapp.service;

import com.chatapp.mainchatapp.entity.AppUser;
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

    public ResponseEntity<List<AppUser>> geAllUsers() {
        try{
            return new ResponseEntity<>(userRepo.findAll(), HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
        }

        return new ResponseEntity<>(new ArrayList<>(),HttpStatus.BAD_REQUEST);
    }


    public ResponseEntity<AppUser> getUser(String uId) {
        try{
            AppUser appUser = userRepo.findById(uId)
                    .orElseThrow(() -> new RuntimeException("AppUser not found"));

            return new ResponseEntity<>(appUser,HttpStatus.OK);
        }
        catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }



    public void deleteUser(String uId) {
        if (!userRepo.existsById(uId)){
            throw new RuntimeException("AppUser not found with id : " + uId);
        }
        userRepo.deleteById(uId);
    }

    public ResponseEntity<?> disableUser(String uId) {

        Optional<AppUser> optionalUserForDisable = userRepo.findById(uId);

        if (optionalUserForDisable.isEmpty()){
            return new ResponseEntity<>("AppUser not found",HttpStatus.NOT_FOUND);
        }
        if (!optionalUserForDisable.get().isEnabled()) {
            return new ResponseEntity<>("AppUser is already disabled",HttpStatus.OK);
        }

        AppUser appUser = optionalUserForDisable.get();
        appUser.setEnabled(false);
        userRepo.save(appUser);

        return new ResponseEntity<>(appUser.getName() + ", you are disabled by Admin",HttpStatus.OK);
    }

    public ResponseEntity<?> enableUser(String uId) {

        Optional<AppUser> optionalUserForEnable = userRepo.findById(uId);

        if (optionalUserForEnable.isEmpty()){
            return new ResponseEntity<>("AppUser not found",HttpStatus.NOT_FOUND);
        }
        if (optionalUserForEnable.get().isEnabled()){
            return new ResponseEntity<>("AppUser is already Enabled",HttpStatus.OK);
        }

        AppUser appUser = optionalUserForEnable.get();
        appUser.setEnabled(true);
        userRepo.save(appUser);

        return new ResponseEntity<>(appUser.getName() + ", you are enabled by Admin",HttpStatus.OK);
    }
}
