(function (){
    'use strict';

    var autorunHandle;
    var messagesSubscription;
    var userSubscription;
    var messagesWatcher;
    
    function fetchUserName(doc) {
      if (doc.name) {
        return doc.name;
      } else if (doc.profile && doc.profile.name) {
        return doc.profile.name;
      } else if (doc.emails[0] && doc.emails[0].address){
        return doc.emails[0].address;
      }
      return "Anonymous";
    };
    
    Template.chatMain.messages = function() {
        return Messages.find({roomId: Session.get("currentRoom")}, { sort: [ ["date", "desc"] ],
            transform: function(doc) {
                var userObj = Meteor.users.findOne(doc.userId);
                var user = {};
                user.name = fetchUserName(userObj);
                user._id = userObj._id;
                doc.user = user;
                doc.date = (new Date(doc.date)).toLocaleString();
                return doc;
            }
        });
    };
    
    Template.chatMain.created = function() {
        autorunHandle = Deps.autorun(function() {
            userSubscription = Meteor.subscribe("users");
            messagesSubscription = Meteor.subscribe("messages", Session.get("currentRoom"));
            
            var timeCheck = (new Date()).getTime();
            messagesWatcher = Messages.find({roomId: Session.get("currentRoom")}).observeChanges({
               'added': function(id, doc) {
                   if (doc.date < timeCheck || doc.userId === Meteor.userId()) {
                       return;
                   }
                   
                   // Issue notification
                   $.bootstrapGrowl(doc.content, {
                       'type': 'info'
                   });
               } 
            });
        });
    };
    
    Template.chatMain.events = {
        'click a.message': function(e, t) {
            e.preventDefault();
            var input = t.find('input[name="message"]');
            Messages.insert({content: input.value, userId: Meteor.userId(), roomId: Session.get("currentRoom"), date: (new Date()).getTime() });
            input.value = '';
        },
        'keypress input': function(e, t, c) {
            if (e.charCode === 13) {
                t.find('a.message').click();
                e.preventDefault();
            }
        }
    };
    
    Template.chatMain.destroyed = function() {
        autorunHandle.stop();
        messagesSubscription.stop();
        messagesWatcher.stop();
        userSubscription.stop();
    };
    
    Template.chatMain.currentRoom = function() {
        return Rooms.findOne(Session.get('currentRoom'));
    };
}());