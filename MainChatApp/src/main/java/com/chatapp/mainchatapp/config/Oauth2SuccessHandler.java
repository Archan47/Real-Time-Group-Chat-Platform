package com.chatapp.mainchatapp.config;

import com.chatapp.mainchatapp.entity.AppUser;
import com.chatapp.mainchatapp.entity.Role;
import com.chatapp.mainchatapp.repo.UserRepo;
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

@AllArgsConstructor
@Component
public class Oauth2SuccessHandler implements AuthenticationSuccessHandler {


    private UserRepo userRepo;

    private static final Logger logger =
            LoggerFactory.getLogger(Oauth2SuccessHandler.class);

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
                                        HttpServletResponse response,
                                        Authentication authentication)
            throws IOException, ServletException {

        logger.info("OAuth2 Authentication Successful");
        logger.info(authentication.toString());


        OAuth2User oAuth2User = (OAuth2User)authentication.getPrincipal();

        // identify user

        String registrationId = "unknown";
        if (authentication instanceof OAuth2AuthenticationToken token){
            registrationId = token.getAuthorizedClientRegistrationId();
        }

        logger.info("registrationId : " + registrationId);
        logger.info("user : " + oAuth2User.getAttributes().toString());

        switch (registrationId) {
            case "google" -> {
                String googleId = oAuth2User.getAttribute("sub");
                String email = oAuth2User.getAttribute("email");
                String name = oAuth2User.getAttribute("name");
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
                    logger.info("New Google user saved");
                } else {
                    logger.info("User already exists");
                }
            }

            default -> throw new RuntimeException("Invalid Registration");
        }

    }



}