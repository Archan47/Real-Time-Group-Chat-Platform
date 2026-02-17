package com.chatapp.mainchatapp.entity;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import javax.management.relation.Role;
import java.time.LocalDateTime;

@Document(collection = "users")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class User {

    @Id
    private String id;
    @Indexed(unique = true)
    private String name;
    @Indexed(unique = true)
    private String email;
    private String password;

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
