package com.chatapp.mainchatapp.service;


import com.chatapp.mainchatapp.entity.Message;
import com.chatapp.mainchatapp.entity.Room;
import com.chatapp.mainchatapp.payload.MessageRequest;
import com.chatapp.mainchatapp.repo.RoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ChatService {

    @Autowired
    private RoomRepository roomRepository;

    public Message sendMessage(String roomId, MessageRequest messageRequest) {

        Room room = roomRepository.findByRoomId(messageRequest.getRoomId());

        Message message = new Message();
        message.setSender(messageRequest.getSender());
        message.setContent(messageRequest.getContent());
        message.setTimeStamp(messageRequest.getMessageTime());

        if (room !=  null){
            room.getMessages().add(message);
            roomRepository.save(room);
        }
        else {
            throw new RuntimeException("Room not found");
        }

        return message;
    }
}
