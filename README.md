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
1.  Satisfy Mean.js dependencies:
  1.  Install nodejs and npm:
    *  https://nodejs.org/en/download/
  2.  Set up a MongoDB:
    *  https://www.mongodb.org/downloads#production
  3.  Install bower:
    *  `npm install -g bower`
  4.  Install grunt-cli:
    *  `npm install -g grunt-cli`
2.  Clone the repository:
  *  `git clone https://github.com/CyberNinjas/TallyCTF.git`
3.  Change directory into the mean folder:
  *  `cd ./TallyCTF/mean`
4.  Install meanjs/node dependencies:
  *  `npm install`
5.  Edit local-production.js to your preference (Local vs. remote Mongo)
  1.  Browse to `TallyCTF/mean/config/env`
  2.  Copy `local.example.js` to `local-production.js`
  3.  Edit the `uri` and options to match your mongo server's uri and credentials.  If you are running a local Mongo instance, the default settings provided should connect without modification.
6.  Run meanjs using grunt:
  *  `grunt prod`

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
