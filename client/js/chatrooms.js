(function() {
    'use strict';
    
    var rooms;
        
    Template.chatrooms.events = {
      'click a.create-room': function(e, t) {
          e.preventDefault();
          bootbox.prompt("Name your room", function(result) {
              if (result === null) {
                  return;
              } else {
                  var x = Rooms.findOne({name: result});
                  if (x === undefined) {
                      Rooms.insert({name: result});
                  } else {
                      $.bootstrapGrowl("A room with that name already exists.");
                  }
              }
          });
      },
      'click li a': function(e, t) {
          e.preventDefault();
          
          Session.set('currentRoom', this._id);
      }
    };
    
    Template.chatrooms.created = function() {
        rooms = Meteor.subscribe("rooms");
    };
    
    Template.chatrooms.rooms = function() {
        return Rooms.find();
    };
    
    Template.chatrooms.destroyed = function() {
        rooms.stop();
    };
}());