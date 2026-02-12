package com.chatapp.mainchatapp.repo;

import com.chatapp.mainchatapp.entity.Room;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface RoomRepository extends MongoRepository<Room,String> {

    // Get room id
    Room findByRoomId(String roomId);

}
