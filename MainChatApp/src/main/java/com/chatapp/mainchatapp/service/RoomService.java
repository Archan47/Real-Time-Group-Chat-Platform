package com.chatapp.mainchatapp.service;


import com.chatapp.mainchatapp.dto.RoomRequest;
import com.chatapp.mainchatapp.entity.Message;
import com.chatapp.mainchatapp.entity.Room;
import com.chatapp.mainchatapp.repo.RoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RoomService {

    @Autowired
    private RoomRepository roomRepository;


    public ResponseEntity<?> createRoom(RoomRequest request) {
        if (roomRepository.findByRoomId(request.getRoomId()) != null){
            return ResponseEntity.badRequest().body("Room already exists!");
        }
        Room room = new Room();
        room.setRoomId(request.getRoomId());
        Room savedRoom = roomRepository.save(room);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedRoom);
    }

    public ResponseEntity<?> joinRoom(String roomId) {
        
        Room room = roomRepository.findByRoomId(roomId);

        try{
            if (room != null){
                return ResponseEntity.status(HttpStatus.OK).body("You have entered in the room..");
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Room not Found !!");
    }

    public ResponseEntity<List<Message>> getMessages(String roomId, int page, int size) {

        Room room = roomRepository.findByRoomId(roomId);

        if (room == null){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        List<Message> messages = room.getMessages();

        int start = Math.max(0,messages.size() - (page + 1) * size);
        int end = Math.min(messages.size(), start + size);
        List<Message> paginatedMessage =  messages.subList(start,end);
        return ResponseEntity.status(HttpStatus.OK).body(paginatedMessage);

    }
}
