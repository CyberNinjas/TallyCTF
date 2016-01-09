'use strict';

describe('Challenges E2E Tests:', function () {
  describe('Test challenges page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3000/challenges');
      expect(element.all(by.repeater('challenges in challenges')).count()).toEqual(0);
    });
  });
});
