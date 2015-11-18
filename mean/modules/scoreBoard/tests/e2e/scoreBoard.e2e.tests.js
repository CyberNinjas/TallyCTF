'use strict';

describe('ScoreBoard E2E Tests:', function () {
  describe('Test scoreBoard page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/scoreBoard');
      expect(element.all(by.repeater('scoreBoard in scoreBoard')).count()).toEqual(0);
    });
  });
});
