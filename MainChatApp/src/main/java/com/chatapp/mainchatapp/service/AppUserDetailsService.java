package com.chatapp.mainchatapp.service;

import com.chatapp.mainchatapp.entity.AppUser;
import org.springframework.security.core.userdetails.*;
import com.chatapp.mainchatapp.repo.UserRepo;
import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;

import java.util.ArrayList;

@Service
@RequiredArgsConstructor
public class AppUserDetailsService implements UserDetailsService {

    private final UserRepo userRepo;

    @Override
    public UserDetails loadUserByUsername(String email)
            throws UsernameNotFoundException {

        AppUser existingUser = userRepo.findByEmail(email);

        if (existingUser == null) {
            throw new UsernameNotFoundException("Email not found: " + email);
        }

        return new User(
                existingUser.getEmail(),
                existingUser.getPassword(),
                new ArrayList<>()
        );
    }
}
