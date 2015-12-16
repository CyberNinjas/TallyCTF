# TallyCTF
Capture-The-Flag Scoreboard & CTF Event Running Software.

## Features Implemented

### Admin
#### CTF Events
  *  Define CTF event
    *  Start & End time, Title
  *  Save CTF event
    *  Challenges, Users, Teams
  *  Load CTF Event
	*  Challenges, Users, Teams

#### Challenges
  *  Create Challenges
    *  Title
    *  Category
    *  Description
	*  Points
	*  Flag value
	  *  String value
      *  Regex value
      *  Multiple answers per challenge

#### User Authentication
  *  Manage User Authentication Schemes
	*  Dynamic generation of custom user authentications (OAuth2.0 & OpenIDConnect)

### Users
#### Registration
  *  Create local accounts stored on Mongo
  *  Log in using Auth provider (Google, Facebook, etc..)
  *  Join Team
  *  Create Team

### Teams
  *  Invite Users to team 
  *  Accept/Reject requests to join Team as Team Captain
  *  View team members

### Scoreboard
  *  Team members can Submit answers for challenges
  *  Earn points for correct submissions
  *  Points count for team score
  *  Teams ranked by points
  *  Display solved challenges per team

## For screenshots of all listed features, visit this [Imgur Link](https://imgur.com/a/Y4h2B)

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

### Acknowledgements
- Thank you to the MeanJS team for providing a robust framework 
- And to [Eonasdan](https://github.com/Eonasdan) for their Date Time Picker module
- Additionlly, Thank you to [Doug Logan](https://www.cyberninjas.com/) for his encouragement and help with this project
