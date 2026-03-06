package com.chatapp.mainchatapp.config;

import com.chatapp.mainchatapp.entity.AppUser;
import com.chatapp.mainchatapp.entity.RefreshToken;
import com.chatapp.mainchatapp.entity.Role;
import com.chatapp.mainchatapp.repo.UserRepo;
import com.chatapp.mainchatapp.service.RefreshTokenService;
import com.chatapp.mainchatapp.util.JwtUtil;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.AllArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

@AllArgsConstructor
@Component
public class Oauth2SuccessHandler implements AuthenticationSuccessHandler {

    private UserRepo userRepo;
    private JwtUtil jwtUtil;
    private RefreshTokenService refreshTokenService;

    private static final Logger logger =
            LoggerFactory.getLogger(Oauth2SuccessHandler.class);

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
                                        HttpServletResponse response,
                                        Authentication authentication)
            throws IOException, ServletException {

        logger.info("OAuth2 Authentication Successful");

        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();

        String registrationId = "unknown";
        if (authentication instanceof OAuth2AuthenticationToken token) {
            registrationId = token.getAuthorizedClientRegistrationId();
        }

        switch (registrationId) {
            case "google" -> {
                String email   = oAuth2User.getAttribute("email");
                String name    = oAuth2User.getAttribute("name");
                String picture = oAuth2User.getAttribute("picture");

                if (!userRepo.existsByEmail(email)) {
                    AppUser user = AppUser.builder()
                            .email(email)
                            .name(name)
                            .profilePicUrl(picture)
                            .enabled(true)
                            .role(Role.USER)
                            .isAccountVerified(true)
                            .build();
                    userRepo.save(user);
                    logger.info("New Google user saved: {}", email);
                } else {
                    logger.info("Google user already exists: {}", email);
                }

                String accessToken = jwtUtil.generateToken(email, "ROLE_USER");
                RefreshToken refreshTokenEntity = refreshTokenService.createRefreshToken(email);
                String refreshToken = jwtUtil.generateRefreshToken(email, refreshTokenEntity.getJti());

                // URL-encode everything — JWTs and picture URLs have special chars
                String encodedAccess   = URLEncoder.encode(accessToken,  StandardCharsets.UTF_8);
                String encodedRefresh  = URLEncoder.encode(refreshToken, StandardCharsets.UTF_8);
                String encodedName     = URLEncoder.encode(name    != null ? name    : "", StandardCharsets.UTF_8);
                String encodedPicture  = URLEncoder.encode(picture != null ? picture : "", StandardCharsets.UTF_8);

                String redirectUrl = "http://localhost:5173/oauth2/callback"
                        + "?accessToken="  + encodedAccess
                        + "&refreshToken=" + encodedRefresh
                        + "&name="         + encodedName
                        + "&picture="      + encodedPicture;

                logger.info("Redirecting with tokens for: {}", email);
                response.sendRedirect(redirectUrl);
            }

            default -> {
                logger.error("Unknown OAuth2 provider: {}", registrationId);
                response.sendRedirect("http://localhost:5173/login?error=unknown_provider");
            }
        }
    }
}