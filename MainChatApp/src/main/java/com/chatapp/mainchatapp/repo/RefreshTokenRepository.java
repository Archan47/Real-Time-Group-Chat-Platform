package com.chatapp.mainchatapp.repo;

import com.chatapp.mainchatapp.entity.RefreshToken;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface RefreshTokenRepository extends MongoRepository<RefreshToken,String> {


    Optional<RefreshToken> findByJti(String jti);

    void deleteByUserId (String userId);

}
