'use strict';


// at the top of the test spec:
var fs = require('fs');

// abstract writing screen shot to a file
function writeScreenShot(data, filename) {
    var stream = fs.createWriteStream(filename);
    stream.write(new Buffer(data, 'base64'));
    stream.end();
}


//******** Guests **********//

  //Traverse through the HomePage,Scoreboard,Teams

  // //Register an account
  // describe('Create a User',function(){
  //   it('Should create a new user',function(){
  //     browser.get('http://localhost:3000/authentication/signup');
  //     var firstname = element(by.model('credentials.firstName'));
  //     var lastname = element(by.model('credentials.lastName'));
  //     var country = element(by.model('credentials.country'));
  //     var email = element(by.model('credentials.email'));
  //     var username = element(by.model('credentials.username'));
  //     var password = element(by.model('credentials.password'));
  //     var button = element(by.buttonText('Sign up'));
  //
  //     firstname.sendKeys('admin');
  //     browser.sleep(500);
  //     lastname.sendKeys('admin');
  //     browser.sleep(500);
  //     country.sendKeys('Denmark');
  //     browser.sleep(500);
  //     email.sendKeys('admin@admin.com');
  //     browser.sleep(500);
  //     username.sendKeys('admin');
  //     browser.sleep(500);
  //     password.sendKeys('1Qasdfghjkl;\'');
  //     browser.sleep(500);
  //
  //     button.click();
  //     browser.takeScreenshot().then(function (png){
  //         writeScreenShot(png, 'screenshots/createUser.png');
  //     });
  //     browser.sleep(500);
  //     var name = element(by.binding('authentication.user.username'));
  //     expect(name.getText()).toEqual('admin');
  //   });
  // });

  //Get to the sign in page


//******** Users  **********// Refresh after each use

  //Sign in
  // //Test to log user in
  describe('Signin Acceptance',function(){
    it('Should sign the user in',function(){
      browser.get('http://localhost:3000/authentication/signin');
      browser.sleep(1000);
      var username = element(by.model('credentials.username'));
      var password = element(by.model('credentials.password'));
      var button = element(by.buttonText('Sign in'));
      //username.sendKeys('admin');
      username.sendKeys('admin');
      browser.sleep(500);
      password.sendKeys('1Qasdfghjkl;\'');
      browser.sleep(500);
      button.click();
      var name = element(by.binding('authentication.user.username'));
      //expect(name.getText()).toEqual('admin');
      expect(name.getText()).toEqual('admin');
    });
  });

  //Traverse through the HomePage,Challenges,Scoreboard,Teams

  //***** Challenges ******//
    //*** User not on team ***//
      //In challenges, list out challenges
      // describe('User not on a team',function(){
      //   it('should just list out challenges',function(){
      //     browser.get('http://localhost:3000/challenges');
      //     var allOptions = element.all(by.options("challenge as challenge.category for challenge in challenges | unique: 'category' | orderBy: 'category'"));
      //     browser.sleep(500);
      //     var secondOption = allOptions.get(1);
      //     var RegEx = element(by.binding('RegEx'));
      //     browser.sleep(500);
      //     expect(secondOption.getText()).toEqual('RegEx');
      //     browser.takeScreenshot().then(function (png){
      //         writeScreenShot(png, 'screenshots/createUser.png');
      //     });
      //   });
      // });
      //
      //
      // //In challenges, click on a challenge, see description
      // describe('User not on a team',function(){
      //   it('should click on a challenge',function(){
      //     var challenge = element.all(by.repeater("challenge in challenges | filter:{category: challengeFilter.category}:true | orderBy:sortType:reverseSort").column('challenge.name'));
      //     var actual = challenge.get(0);
      //     actual.click();
      //     browser.sleep(1000);
      //     var text = element(by.linkText('You must be on a team to submit answers!'));
      //     expect(text.getText()).toEqual('You must be on a team to submit answers!');
      //   });
      // });


    //*** User on a team ***//
      //In challenges, list out challenges
      // describe('User on a team',function(){
      //   it('should just list out challenges',function(){
      //     browser.get('http://localhost:3000/challenges');
      //
      //     //Get all challenges and then filter by requested identifier. (Regex)
      //     var allOptions = element.all(by.options("challenge as challenge.category for challenge in challenges | unique: 'category' | orderBy: 'category'"));
      //     browser.sleep(500);
      //     var secondOption = allOptions.get(1);
      //     secondOption.click();
      //     browser.sleep(500);
      //     expect(secondOption.getText()).toEqual('RegEx');
      //     browser.takeScreenshot().then(function (png){
      //         writeScreenShot(png, 'screenshots/createUser.png');
      //     });
      //   });
      // });
      //
      // //In challenges, answer a challenge incorrectly THEN answer it correctly
      // describe('User on a team',function(){
      //   it('should click on a challenge',function(){
      //
      //     var challenge = element.all(by.repeater("challenge in challenges | filter:{category: challengeFilter.category}:true | orderBy:sortType:reverseSort").column('challenge.name'));
      //     var actual = challenge.get(0);
      //     actual.click();
      //     browser.sleep(2000);
      //     var answer = element(by.model('challenge.solve'));
      //     answer.sendKeys('\\dd*');
      //     var button = element(by.className('submitButton'));
      //     button.click();
      //     browser.sleep(3000);
      //     var alertDialog = browser.switchTo().alert();
      //     alertDialog.accept();
      //     answer.clear();
      //     answer.sendKeys('\\d*');
      //     button.click();
      //     browser.sleep(3000);
      //     alertDialog = browser.switchTo().alert();
      //     alertDialog.accept();
      //     expect(alertDialog.getText()).toEqual('Correct!');
      //   });
      // });

  // //***** Scoreboard ******//
    //click on team
    describe("Users (team or no team)",function(){
      it("should be able to view scoreboard",function(){
        browser.get('http://localhost:3000/scoreBoard');
        var scoreBoard = element.all(by.repeater("scoreBoard in scoreBoards").column('scoreBoard.team.teamName'));
        var actual = scoreBoard.first();
        actual.click();
        browser.sleep(2000);

        var actual1 = element(by.binding('scoreBoard.team.teamName'));
        browser.sleep(2000);
        expect(actual1.getText()).toEqual(actual);
      });
    });
    //click on solved challenges

  //***** Teams *****//
    //*** User not on a Team ***//
      //Click on a team
      //click on Request to Join
      //Click on user's myTeam and view pending request status
      //Click to decline askToJoin
      //Click to accept askToJoin team


    //*** User on a Team ****//
      //Click on teams
      //Click on their team and see team members
      //Click on myTeam and see if registered to that team

    //*** Team Captain (teams) ***//
      //click on my team
      //click on "+"
        //add a user
        //click on my team again
      //Accept pending user
      //Decline pending user
      //click on edit
        //change name
        //delete a team member
        //press update
      //click on my team again
        //click delete
        //confirm delete


//******** Admin  **********//

  //Traverse through the HomePage,Challenges,Scoreboard,Teams

  //**** Challenges ****//
    //List challenges (assuming ctfEvent start time is bug)
    //Create a challenge
    //edit a challenge
    //delete a challenge
    //confirm delete

  //**** Scoreboard ****//
    //Same as a User

  //**** Teams ****//
    //Edit any team
    //Delete any team

  //*** Manage User Auths ***//
    //Create a User Auth

  //*** Manage Users ***//
    //Manage Users
    //Edit Users
    //Delete Users
    //Confirm delete

  //*** Manage Events ***//
    //Create an Event
    //Click on Current Event
    //Edit/Fill Current Event
    //Update Events
    //Check options --> save Event
    //Check options --> delete Event
    //Set any event --> Current event








// //******************************//
// // //Test to log user in
// describe('Signin Acceptance',function(){
//   it('Should sign the user in',function(){
//
//
//     browser.get('http://localhost:3000');
//     var button1 = element(by.className('dropdown-toggle user-header-dropdown-toggle'));
//     button1.click();
//     browser.sleep(1000);
//     var username = element(by.model('credentials.username'));
//     var password = element(by.model('credentials.password'));
//     var button = element(by.buttonText('Sign in'));
//     username.sendKeys('admin');
//     browser.sleep(500);
//     password.sendKeys('1Qasdfghjkl;\'');
//     browser.sleep(500);
//     button.click();
//     var name = element(by.binding('authentication.user.username'));
//     expect(name.getText()).toEqual('admin');
//   });
// });
// //******************************//


// //Test to see if User can view and edit settings
// describe('Change Users Settings',function(){
//   it('Should change the settings',function(){
//     browser.setLocation('settings/profile');
//     var firstname = element(by.model('user.firstName'));
//     browser.sleep(500);
//     var lastname = element(by.model('user.lastName'));
//     browser.sleep(500);
//     var country = element(by.model('user.country'));
//     browser.sleep(500);
//     var email = element(by.model('user.email'));
//     browser.sleep(500);
//     var username = element(by.model('user.username'));
//     browser.sleep(500);
//     var button = element(by.buttonText('Save Profile'));
//
//     firstname.clear();
//     lastname.clear();
//     email.clear();
//     username.clear();
//
//     firstname.sendKeys('adminFirst');
//     lastname.sendKeys('adminLast;\'');
//     country.sendKeys('Denmark');
//     email.sendKeys('nic@nic.com');
//     username.clear();
//     username.sendKeys('admin1');
//     button.click();
//     var name = element(by.binding('authentication.user.username'));
//     browser.sleep(500);
//     expect(name.getText()).toEqual('admin1');
//   });
// });
