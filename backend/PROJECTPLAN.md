# ARASH BlueSky Implementation

### ATProtcol Client

Use ATProtocol to let the main application interact with Bluesky: My App -> ATProtocol -> Bluesky 

### React Frontend 

Feed Bluesky data into a react based user interface 

### PostgreSQL for database storing video verification info 

Not sure 100% how this would work (need to look more into ARASH), but from my understanding the basic idea is the videos are verified of the original(verified) videos, so i'll use this database to store this information. I would also look into how this would work with user logins and storing credentials (unsure what this will include at the moment, need to look some more into this)

### FastAPI 

Simplest way I've looked into for frontend and backend communication
React -> FastAPI 
FastAPI -> ATProtocol + Authenticator + Database 

## Task List 

### Implement ATProtocol Client 
- Set up ATProtocol to grab all the elements of Bluesky that I want to include in the application e.g. feed, posts login 

### Set up the basic user feed using ATProtocol and React: 
- Allow users tosee posts on their feed. At this stage i'm not going to worry too deeply about making a good looking UI, but this is something i will want to do at some point in the project 
- Main problem here is figuring out how to translate whatever information im getting from the ATProtocol backend, and properly converting it into the format I want in React 

### Basic database setup - tables for users, videos, verification 

### Set up login functionality 
- User can login to their Bluesky account and see all the expected elements associated to their account 
- Could require some database set up - depends on how much i would want to focus on this aspect as its somewhat not needed as a proof of concept showcase 

### Session storage (???)

### Use Websockets to allow for real time updating 

### Add verification button that associatates with a post and sends the correct information for verification

### Implement the actual verification (ARASH) process (???)

### Return the result of the verification (Is it the same or has it been changed)

# Task List 

## Prototype features
- [x] Login (backend)
- [x] User posts (backend)
- [x] User timeline (backend)
- [x] 