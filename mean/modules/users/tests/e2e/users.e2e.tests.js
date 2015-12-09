'use strict';

// describe('Users E2E Tests:', function () {
//   describe('Signin Validation', function () {
//     it('Should report missing credentials', function () {
//       browser.get('http://localhost:3000/authentication/signin');
//       element(by.css('button[type=submit]')).click();
//       element(by.binding('error')).getText().then(function (errorText) {
//         expect(errorText).toBe('Missing credentials');
//       });
//     });
//   });
// });

//Create a User
// describe('Create a User',function(){
//   it('Should create a new user',function(){
//     browser.get('http://localhost:3000');
//     var username = element(by.model('credentials.username'));
//     var password = element(by.model('credentials.password'));
//     var button = element(by.buttonText('Sign in'));
//     username.sendKeys('admin');
//     password.sendKeys('1Qasdfghjkl;\'');
//     button.click();
//     var name = element(by.binding('authentication.user.username'));
//     expect(name.getText()).toEqual('admin');
//   });
// });


//Test to log user in
describe('Signin Acceptance',function(){
  it('Should sign the user in',function(){
    browser.get('http://localhost:3000/authentication/signin');
    var username = element(by.model('credentials.username'));
    var password = element(by.model('credentials.password'));
    var button = element(by.buttonText('Sign in'));
    username.sendKeys('admin');
    password.sendKeys('1Qasdfghjkl;\'');
    button.click();
    var name = element(by.binding('authentication.user.username'));
    expect(name.getText()).toEqual('admin');
  });
});

//Test to see if User can view team page
describe('Signin Acceptance',function(){
  it('Should view the teams',function(){
    browser.setLocation('teams');
    expect(browser.getCurrentUrl()).toBe('http://localhost:3000/teams');
  });
});


//Test to see if User can view and edit settings
describe('Change Users Settings',function(){
  it('Should change the settings',function(){
    browser.setLocation('settings/profile');
    var firstname = element(by.model('user.firstName'));
    var lastname = element(by.model('user.lastName'));
    var country = element(by.model('user.country'));
    var email = element(by.model('user.email'));
    var username = element(by.model('user.username'));
    var button = element(by.buttonText('Save Profile'));

    firstname.sendKeys('adminFirst');
    lastname.sendKeys('adminLast;\'');
    country.sendKeys('Denmark');
    email.sendKeys('nic@nic.com');
    username.clear();
    username.sendKeys('admin1');
    button.click();
    var name = element(by.binding('authentication.user.username'));
    browser.sleep(3000);
    expect(name.getText()).toEqual('admin1');
  });
});
