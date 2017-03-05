/*
  This script monitors a reddit account's inbox for Game Thread notifications.
  When a thread is received it parses details from the body of the message then
  makes a new post to reddit.com/r/OttawaSenators

  Created by: /u/mandm4s

  credentials.js contains an object declaration with sensitive login/script info. 
  To use script for development purposes speak to creator. 

  Contents of credentials.js look like the following: 
  
   module.exports = {
     info: {
       userAgent: 'user-agent',
       clientId: 'client-id,
       clientSecret: 'client-secret',
       username: 'username',
       password: 'password'
     }
   }
*/

var snoowrap = require('snoowrap');
var credentials = require('./credentials.js');

const client = new snoowrap(credentials.info);

var run = function() {
  var inbox = client.getInbox("messages");

  inbox.then(function(result) {
    var postCreated = false;
    for (i = 0; i < result.length && postCreated == false; i++) {
      var message = checkMessage(result[i])
      if (message != null) {
	var link = getGTLink(message.body);
	postCreated = true;
	makePost(link);
      }
    }
    run(); // TODO - Add sleep before run, otherwise will constantly send requests to Reddit 
  })
}

// If message is from hockey bot and has not been posted already
// TODO - check to see if this Game Thread has been posted already
var checkMessage = function(comment) {
  var author = comment.author.name;
  
  if (author.includes("HockeyGT_Bot")) {
    return comment; 
  }
  return null;
}

// TODO - Makes post to subreddit 
var makePost = function(link) {
  console.log(link);
}

// Parse game thread link from message body, returns null if link does not exist. 
var getGTLink = function(message) {
  var words = message.split(/\s+/); // Splits on any whitespace
  for (i = 0; i < words.length; i++) {
    if (words[i].includes("www.reddit.com/r/hockey/comments/")) {
      return words[i];
    }
  }
  return null;
}

run();
