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
//Register an account
//Get to the sign in page


//******** Users  **********//

//Sign in
//Traverse through the HomePage,Challenges,Scoreboard,Teams

  //On challenges, list out challenges
  //In challenges, filter challenges
  //In challenges, click on a challenge, see shit
  //

//******** Team Captain *********//

//Traverse through the HomePage,Challenges,Scoreboard,Teams

//******** Admin  **********//

//Traverse through the HomePage,Challenges,Scoreboard,Teams

// Create a User
describe('Create a User',function(){
  it('Should create a new user',function(){
    browser.get('http://localhost:3000/authentication/signup');
    var firstname = element(by.model('credentials.firstName'));
    var lastname = element(by.model('credentials.lastName'));
    var country = element(by.model('credentials.country'));
    var email = element(by.model('credentials.email'));
    var username = element(by.model('credentials.username'));
    var password = element(by.model('credentials.password'));
    var button = element(by.buttonText('Sign up'));

    firstname.sendKeys('admin');
    browser.sleep(500);
    lastname.sendKeys('admin');
    browser.sleep(500);
    country.sendKeys('Denmark');
    browser.sleep(500);
    email.sendKeys('admin@admin.com');
    browser.sleep(500);
    username.sendKeys('admin');
    browser.sleep(500);
    password.sendKeys('1Qasdfghjkl;\'');
    browser.sleep(500);

    button.click();
    browser.takeScreenshot().then(function (png){
        writeScreenShot(png, 'createUser.png');
    });
    browser.sleep(500);
    var name = element(by.binding('authentication.user.username'));
    expect(name.getText()).toEqual('admin');
  });
});


// //******************************//
// // //Test to log user in
// describe('Signin Acceptance',function(){
//   it('Should sign the user in',function(){
//     browser.get('http://localhost:3000');
//     var signOutButton = element(by.model('menu'));
//     signOutButton.$('[value="Signout"]').click();
//     signOutButton.click();
//     browser.sleep(2000);
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
