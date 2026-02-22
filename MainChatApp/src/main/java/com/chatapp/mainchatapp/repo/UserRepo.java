package com.chatapp.mainchatapp.repo;

import com.chatapp.mainchatapp.entity.AppUser;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface UserRepo extends MongoRepository<AppUser,String> {

    //AppUser findByUserId(String userId);
    AppUser findByEmail(String email);
    boolean existsByEmail(String email);
}
