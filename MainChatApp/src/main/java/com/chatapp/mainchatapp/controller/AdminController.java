package com.chatapp.mainchatapp.controller;

import com.chatapp.mainchatapp.entity.User;
import com.chatapp.mainchatapp.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;


@RestController
@RequestMapping("api/admin-panel")
public class AdminController {
    @Autowired
    private AdminService adminService;


    @GetMapping("/allusers")
    public ResponseEntity<List<User>> getAllUsers(){
        return adminService.geAllUsers();
    }

    @GetMapping("/getuser/{uId}")
    public ResponseEntity<User> getUser(@PathVariable String uId){
        return adminService.getUser(uId);
    }

    @DeleteMapping("/deleteuser/{uId}")
    public ResponseEntity<?> deleteUser(@PathVariable String uId){
        try{
            adminService.deleteUser(uId);
            return new ResponseEntity<>(HttpStatus.OK);
        }catch (Exception e){
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
