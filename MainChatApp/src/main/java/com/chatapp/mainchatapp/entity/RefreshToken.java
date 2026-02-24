package com.chatapp.mainchatapp.entity;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.Instant;


@Document(collection = "refresh_tokens")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class RefreshToken {

    @Id
    private String id;

    @Indexed(unique = true)
    private String jti;

    @Indexed
    private String userId;

    private Instant tokenCreatedAt;

    private Instant tokenExpiredAt;

    private boolean revoked;

    private String replacedByToken;
}

