package com.chatapp.mainchatapp.service;

import com.chatapp.mainchatapp.entity.AppUser;
import org.springframework.security.core.userdetails.User;
import com.chatapp.mainchatapp.repo.UserRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;

@Service
@RequiredArgsConstructor
public class AppUserDetailsService implements UserDetailsService {

    @Autowired
    private final UserRepo userRepo;


    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        AppUser existingUser;
        try{
            existingUser = userRepo.findByEmail(email);
        } catch (Exception e) {
            throw new UsernameNotFoundException("Email not found for the mail" + email);
        }
        return new User(existingUser.getEmail(), existingUser.getPassword(),new ArrayList<>());
    }
}
