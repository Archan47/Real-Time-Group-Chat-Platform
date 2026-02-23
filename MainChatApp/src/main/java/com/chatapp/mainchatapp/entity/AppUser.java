package com.chatapp.mainchatapp.entity;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Pattern;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;



@Document(collection = "users")
@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class AppUser {

    @Id
    private String id;
    @Indexed(unique = true)
    private String name;
    @Indexed(unique = true)
    private String userId;
    @Indexed(unique = true)
    @Email(regexp = "[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,3}",flags = Pattern.Flag.CASE_INSENSITIVE)
    private String email;
    private String password;

    private String profilePicUrl;

    private String verifyOtp;
    private LocalDateTime verifyOtpExpireAt;
    private String resetOtp;
    private LocalDateTime resetOtpExpireAt;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    private boolean isAccountVerified;
    private boolean enabled;

    private Role role;

}
