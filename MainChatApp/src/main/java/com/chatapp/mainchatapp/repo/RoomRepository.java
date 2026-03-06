package com.chatapp.mainchatapp.repo;

import com.chatapp.mainchatapp.entity.Room;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface RoomRepository extends MongoRepository<Room,String> {

    // Get room id
    Room findByRoomId(String roomId);
    List<Room> findByIsPrivate(boolean isPrivate);

}
