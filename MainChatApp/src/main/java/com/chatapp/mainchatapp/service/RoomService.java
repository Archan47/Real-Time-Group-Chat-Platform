package com.chatapp.mainchatapp.service;


import com.chatapp.mainchatapp.dto.JoinRoomRequest;
import com.chatapp.mainchatapp.dto.RoomRequest;
import com.chatapp.mainchatapp.entity.AppUser;
import com.chatapp.mainchatapp.entity.Message;
import com.chatapp.mainchatapp.entity.Room;
import com.chatapp.mainchatapp.repo.RoomRepository;
import com.chatapp.mainchatapp.repo.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RoomService {

    @Autowired
    private RoomRepository roomRepository;
    @Autowired
    private UserRepo userRepo;



    public ResponseEntity<?> createRoom(RoomRequest request) {

        AppUser appUser = userRepo.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User Not found"));

        if (!appUser.isEnabled()){
            return new ResponseEntity<>(appUser.getName()+", You are Blocked By Monitoring Team for Offensive act",
                    HttpStatus.FORBIDDEN);
        }

        if (roomRepository.findByRoomId(request.getRoomId()) != null){
            return ResponseEntity.badRequest().body("Room already exists!");
        }
        Room room = new Room();
        room.setRoomId(request.getRoomId());
        room.setCreatedBy(appUser.getId());
        room.setPrivate(request.isPrivateRoom());
        roomRepository.save(room);
        return new ResponseEntity<>("Room Created Successfully",HttpStatus.CREATED);
    }

    public ResponseEntity<?> joinRoom(JoinRoomRequest roomRequest) {

        AppUser appUser = userRepo.findById(roomRequest.getUserId()).
                orElseThrow(() -> new RuntimeException("AppUser not found"));

        if (!appUser.isEnabled()){
            return new ResponseEntity<>(appUser.getName()+", You are Blocked By Monitoring Team for Offensive act\n" +
                    "You can not join in Rooms",
                    HttpStatus.FORBIDDEN);
        }
        
        Room room = roomRepository.findByRoomId(roomRequest.getRoomId());

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
