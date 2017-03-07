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
var fs = require('fs'); // File System
var dateTime = require('node-datetime');

const client = new snoowrap(credentials.info);

var filepath = "./recent.txt";

var run = function() {
  var dt = dateTime.create();
  console.log(dt.format('Y-m-d H:M:S') + " - [Running]");
  var inbox = client.getInbox("messages");

  inbox.then(function(result) {
    var postCreated = false;
    for (i = 0; i < result.length && postCreated == false; i++) {
      var message = checkMessage(result[i]);
      if (message != null) {
	var link = getGTLink(message.body);
	postCreated = true;
	makePost(link);
      }
    }
    setTimeout(run, 60000 * 5); // 1 minute == 60000
  })
}

// If message is from hockey bot and has not been posted already
// TODO - check to see if this Game Thread has been posted already
var checkMessage = function(comment) {
 // console.log(comment);
  if (comment.author == null) { return null; }
  var author = comment.author.name;
  var currTime = parseInt(comment.created);
  // Gets int from file containing time from last posted file
  var lastTime = parseInt(fs.readFileSync(filepath).toString().replace(/\s+/g, ''));
 // console.log(lastTime);
  if (author.includes("HockeyGT_Bot") && currTime > lastTime) {
    fs.writeFileSync(filepath, currTime.toString());
    return comment; 
  }
  return null;
}

// Makes post to subreddit 
var makePost = function(link) {
  var dt = dateTime.create();
  var date = dt.format('d/m/Y');
  var title = "Game Thread - " + date;
  var body = "Welcome to the Game Thread for " + date + "\n\n" +
             "[Follow this link to the /r/hockey game thread.]("
             + link + ")\n\n"; 
  console.log(body);
  client.getSubreddit('valentine96_hocky').submitSelfpost({title: title, text: body}).then(console.log);
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
