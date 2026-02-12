package com.chatapp.mainchatapp.controller;


import com.chatapp.mainchatapp.dto.RoomRequest;
import com.chatapp.mainchatapp.entity.Message;
import com.chatapp.mainchatapp.entity.Room;
import com.chatapp.mainchatapp.service.RoomService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("chat/room")
public class RoomController {

    @Autowired
    private RoomService roomService;

    @PostMapping("/create")
    public ResponseEntity<?> createRoom(@RequestBody RoomRequest request){
        return roomService.createRoom(request);
    }

    @GetMapping("/join/{roomId}")
    public ResponseEntity<?> joinRoom(@PathVariable String roomId){
        return roomService.joinRoom(roomId);
    }


    @GetMapping("/messages/{roomId}")
    public ResponseEntity<List<Message>> getMessages(@PathVariable String roomId,
                                                     @RequestParam(value = "page", defaultValue = "0",required = false) int page,
                                                     @RequestParam(value = "size", defaultValue = "20",required = false) int size)

    {
        return roomService.getMessages(roomId,page,size);
    }


}
