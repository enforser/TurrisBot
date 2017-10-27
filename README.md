# TurrisBot

This script monitors a reddit account's inbox for Game Thread notifications.
  
When a thread is received in the bots inbox it parses details from the body of the message then
makes a new post to reddit.com/r/OttawaSenators

I use Node's supervisor to run TurrisBot. 
Example: 
```
Navigate to the project directory
Run:
=> supervisor core.js
```
  
Created by: /u/mandm4s

  
