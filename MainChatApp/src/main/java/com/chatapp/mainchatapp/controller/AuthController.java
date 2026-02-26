package com.chatapp.mainchatapp.controller;


import com.chatapp.mainchatapp.dto.LoginRequest;
import com.chatapp.mainchatapp.dto.LoginResponse;
import com.chatapp.mainchatapp.entity.AppUser;
import com.chatapp.mainchatapp.entity.RefreshToken;
import com.chatapp.mainchatapp.repo.RefreshTokenRepository;
import com.chatapp.mainchatapp.repo.UserRepo;
import com.chatapp.mainchatapp.service.EmailService;
import com.chatapp.mainchatapp.service.RefreshTokenService;
import com.chatapp.mainchatapp.util.JwtUtil;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import java.util.Objects;

@RestController
@RequiredArgsConstructor
@RequestMapping("api/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final RefreshTokenService refreshTokenService;
    private final RefreshTokenRepository refreshTokenRepository;

    private final EmailService emailService;
    private final UserRepo userRepo;

    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginRequest request) {

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        String email = authentication.getName();

        String role = authentication.getAuthorities()
                .stream()
                .findFirst()
                .map(GrantedAuthority::getAuthority)
                .orElse("ROLE_USER");

        // Generate Access Token
        String accessToken = jwtUtil.generateToken(email, role);

        // Create RefreshToken in DB
        RefreshToken refreshTokenEntity =
                refreshTokenService.createRefreshToken(email);

        // Generate Refresh JWT
        String refreshToken =
                jwtUtil.generateRefreshToken(email, refreshTokenEntity.getJti());

        AppUser user = userRepo.findByEmail(email);
        if (Objects.equals(user.getEmail(), email)) {
            emailService.sendLoginMail(
                    email,
                    user.getName()
            );
        }

        return ResponseEntity.ok(new LoginResponse(accessToken,refreshToken,"Welcome Back User")).getBody();
    }


    @PostMapping("/refresh")
    public LoginResponse refresh(@RequestParam String refreshToken){
        String username = jwtUtil.extractUsername(refreshToken);
        String jti = jwtUtil.extractAllClaims(refreshToken).getId();

        RefreshToken storedToken = refreshTokenService
                .verifyRefreshToken(
                        refreshTokenService.getByJti(jti)
                );

        String newAccessToken =
                jwtUtil.generateToken(username, "ROLE_USER");

        return new LoginResponse(newAccessToken, refreshToken,"");
    }


    @PostMapping("/logout")
    public ResponseEntity<String> logout(HttpServletRequest request){

        String refreshToken = extractFromCookie(request);

        refreshTokenService.revokeToken(refreshToken);

        // Clear cookie
        ResponseCookie deleteCookie = ResponseCookie.from("refreshToken", "")
                .httpOnly(true)
                .secure(true)
                .path("/")
                .maxAge(0)
                .build();

        return ResponseEntity.ok("Logged out successfully");
    }

    private String extractFromCookie(HttpServletRequest request) {

        if (request.getCookies() == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "No cookies found");
        }

        for (Cookie cookie : request.getCookies()) {
            if ("refreshToken".equals(cookie.getName())) {
                return cookie.getValue();
            }
        }

        throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Refresh token not found");
    }

}
