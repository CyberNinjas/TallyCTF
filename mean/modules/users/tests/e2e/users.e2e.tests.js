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
