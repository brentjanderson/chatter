(function() {
    'use strict';
    
    Meteor.publish("rooms", function() {
        return Rooms.find();
    });
    
    Meteor.publish("messages", function(rId) {
        return Messages.find({roomId: rId});
    });
        
    Rooms.allow({
       insert: function( userId, room) {
           var existing = Rooms.findOne({name: room.name});
           if (existing !== undefined) {
               return false;
           }
           
           return true;
       } 
    });
    
    Messages.allow({
        insert: function(userId, room) {
            return true;
        }
    })
}());