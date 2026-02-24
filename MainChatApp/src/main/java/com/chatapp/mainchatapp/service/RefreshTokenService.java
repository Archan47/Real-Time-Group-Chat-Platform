package com.chatapp.mainchatapp.service;

import com.chatapp.mainchatapp.entity.RefreshToken;
import com.chatapp.mainchatapp.repo.RefreshTokenRepository;
import com.chatapp.mainchatapp.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.UUID;


@Service
@RequiredArgsConstructor
public class RefreshTokenService {

    private final RefreshTokenRepository refreshTokenRepository;

    private final JwtUtil jwtUtil;

    public RefreshToken createRefreshToken(String userId){

        RefreshToken refreshToken = RefreshToken.builder()
                .jti(UUID.randomUUID().toString())
                .userId(userId)
                .tokenCreatedAt(Instant.now())
                .tokenExpiredAt(Instant.now().plusSeconds(7 * 24 * 60 * 60))
                .revoked(false)
                .build();

        return refreshTokenRepository.save(refreshToken);
    }

    public RefreshToken verifyRefreshToken(RefreshToken token){
        if (token.isRevoked() || token.getTokenExpiredAt().isBefore(Instant.now())){
            throw new RuntimeException("Refresh token expired or revoked");
        }
        if (token.getTokenExpiredAt().isBefore(Instant.now())) {
            throw new RuntimeException("Token expired");
        }
        return token;
    }

    public void revokeAllUserTokens(String userId){
        refreshTokenRepository.deleteByUserId(userId);
    }

    public RefreshToken getByJti(String jti) {
        return refreshTokenRepository.findByJti(jti)
                .orElseThrow(() -> new RuntimeException("Refresh token not found"));
    }


    // For logout
    public void revokeToken(String refreshToken) {

        String jti = jwtUtil.extractAllClaims(refreshToken).getId();

        RefreshToken token = refreshTokenRepository.findByJti(jti)
                .orElseThrow(() -> new RuntimeException("Token not found"));

        token.setRevoked(true);

        refreshTokenRepository.save(token);
    }
}
