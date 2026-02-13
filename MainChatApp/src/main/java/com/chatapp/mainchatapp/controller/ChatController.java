package com.chatapp.mainchatapp.controller;


import com.chatapp.mainchatapp.entity.Message;
import com.chatapp.mainchatapp.payload.MessageRequest;
import com.chatapp.mainchatapp.repo.RoomRepository;
import com.chatapp.mainchatapp.service.ChatService;
import com.chatapp.mainchatapp.service.RoomService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ChatController {

    @Autowired
    private ChatService chatService;


    @SendTo("/topic/room/{roomId}")
    @MessageMapping("/sendMessage/{roomId}")
    public Message sendMessage(@DestinationVariable String roomId, @RequestBody MessageRequest messageRequest){
        return chatService.sendMessage(roomId,messageRequest);
    }

}
