package com.chatapp.mainchatapp.dto;


import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RoomRequest {

    @NotNull
    private String roomId;
    @NotNull
    private String userId;
    @NotNull
    private boolean privateRoom;

}
