# TallyCTF
Capture-The-Flag Scoreboard & CTF Event Running Software.

## Features Implemented

### Challenges
- CR
- Basic checking of answers
- Basic scoring

### Events
- CRUD
- Saving / Loading past events (of the current instance)

### Score Board
- CRUD
- Display the current scores of all teams
- Display solved challenges of all teams

### Teams
- CRUD
- Team - User request system
- Displaying members
- Dynamic user addition / deletion

### User Authentication
- CRUD
- Dynamic generation of custom user authentications (OAuth2.0 & OpenIDConnect)

## Bugs
- If a user both requests to join a team and is asked to join a team, dummy data is inserted
- Whacky signin-signout behavior
- Split team management functionality

## Installation
### Prerequisites
This webapp is based off of the [MEAN.js](http://meanjs.org) framework and thus requires all of its dependencies, which can be found [here](http://meanjs.org/docs.html#getting-started).
### Installation
After setting up the prerequisites, simple navigate to the `mean` folder and execute the following:
```bash
TallyCTF/mean $ npm install
TallyCTF/mean $ bower install
TallyCTF/mean $ grunt prod
```
Then navigate to `localhost` and have fun. (`localhost` can also be substituted with the IP address of the deployment server)

## Documentation

Refer to the [docs](TODO).

## Contributors
This project could not have been completed without the major help of the following people:
- [Alexa Chasar](https://github.com/chasara)
- [Nicholas Cioli](https://github.com/nicholascioli)
- [Jonathan Cruz](https://github.com/jonc205)
- [Tom Guarnery](https://github.com/tguar)
- [Dennis Chris James](https://github.com/tobaljackson)
- [Denzel Mathew](https://github.com/dmathew93)