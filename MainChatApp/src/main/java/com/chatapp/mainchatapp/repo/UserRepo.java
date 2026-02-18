package com.chatapp.mainchatapp.repo;

import com.chatapp.mainchatapp.entity.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional;

public interface UserRepo extends MongoRepository<User,String> {

    //User findByUserId(String userId);
    User findByEmail(String email);
    boolean existsByEmail(String email);
}
