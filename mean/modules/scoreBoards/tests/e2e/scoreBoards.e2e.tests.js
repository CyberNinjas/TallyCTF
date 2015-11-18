'use strict';

describe('ScoreBoards E2E Tests:', function () {
  describe('Test scoreBoards page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/scoreBoards');
      expect(element.all(by.repeater('scoreBoard in scoreBoards')).count()).toEqual(0);
    });
  });
});
