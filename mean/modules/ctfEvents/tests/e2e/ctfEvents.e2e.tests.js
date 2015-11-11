'use strict';

describe('CtfEvents E2E Tests:', function () {
  describe('Test ctfEvents page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/ctfEvents');
      expect(element.all(by.repeater('ctfEvent in ctfEvents')).count()).toEqual(0);
    });
  });
});
