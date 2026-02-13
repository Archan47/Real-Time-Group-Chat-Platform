package com.chatapp.mainchatapp.payload;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class MessageRequest {

    private String sender;
    private String content;
    private String roomId;
    private LocalDateTime messageTime;


}
