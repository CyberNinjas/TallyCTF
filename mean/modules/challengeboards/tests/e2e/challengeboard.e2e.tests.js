'use strict';

describe('Challengeboards E2E Tests:', function () {
  describe('Test challengeboards page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3000/challengeboards');
      expect(element.all(by.repeater('challengeboards in challengeboards')).count()).toEqual(0);
    });
  });
});
