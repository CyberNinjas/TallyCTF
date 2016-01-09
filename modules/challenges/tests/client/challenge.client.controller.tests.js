'use strict';

(function () {
  // Challenges Controller Spec
  describe('Challenges Controller Tests', function () {
    // Initialize global variables
    var ChallengesController,
      scope,
      $httpBackend,
      $stateParams,
      $location,
      Authentication,
      Challenges,
      mockChallenge;

    // The $resource service augments the response object with methods for updating and deleting the resource.
    // If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
    // the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
    // When the toEqualData matcher compares two objects, it takes only object properties into
    // account and ignores methods.
    beforeEach(function () {
      jasmine.addMatchers({
        toEqualData: function (util, customEqualityTesters) {
          return {
            compare: function (actual, expected) {
              return {
                pass: angular.equals(actual, expected)
              };
            }
          };
        }
      });
    });

    // Then we can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_, _Authentication_, _Challenges_) {
      // Set a new global scope
      scope = $rootScope.$new();

      // Point global variables to injected services
      $stateParams = _$stateParams_;
      $httpBackend = _$httpBackend_;
      $location = _$location_;
      Authentication = _Authentication_;
      Challenges = _Challenges_;

      // create mock challenges
      mockChallenge = new Challenges({
        _id: '525a8422f6d0f87f0e407a33',
        title: 'An Challenge about MEAN',
        content: 'MEAN rocks!'
      });

      // Mock logged in user
      Authentication.user = {
        roles: ['user']
      };

      // Initialize the Challenges controller.
      ChallengesController = $controller('ChallengesController', {
        $scope: scope
      });
    }));

    it('$scope.find() should create an array with at least one challenges object fetched from XHR', inject(function (Challenges) {
      // Create a sample challenges array that includes the new challenges
      var sampleChallenges = [mockChallenge];

      // Set GET response
      $httpBackend.expectGET('api/challenges').respond(sampleChallenges);

      // Run controller functionality
      scope.find();
      $httpBackend.flush();

      // Test scope value
      expect(scope.challenges).toEqualData(sampleChallenges);
    }));

    it('$scope.findOne() should create an array with one challenges object fetched from XHR using a challengeId URL parameter', inject(function (Challenges) {
      // Set the URL parameter
      $stateParams.challengeId = mockChallenge._id;

      // Set GET response
      $httpBackend.expectGET(/api\/challenges\/([0-9a-fA-F]{24})$/).respond(mockChallenge);

      // Run controller functionality
      scope.findOne();
      $httpBackend.flush();

      // Test scope value
      expect(scope.challenge).toEqualData(mockChallenge);
    }));

    describe('$scope.create()', function () {
      var sampleChallengePostData;

      beforeEach(function () {
        // Create a sample challenges object
        sampleChallengePostData = new Challenges({
          title: 'An Challenge about MEAN',
          content: 'MEAN rocks!'
        });

        // Fixture mock form input values
        scope.title = 'An Challenge about MEAN';
        scope.content = 'MEAN rocks!';

        spyOn($location, 'path');
      });

      it('should send a POST request with the form input values and then locate to new object URL', inject(function (Challenges) {
        // Set POST response
        $httpBackend.expectPOST('api/challenges', sampleChallengePostData).respond(mockChallenge);

        // Run controller functionality
        scope.create(true);
        $httpBackend.flush();

        // Test form inputs are reset
        expect(scope.title).toEqual('');
        expect(scope.content).toEqual('');

        // Test URL redirection after the challenges was created
        expect($location.path.calls.mostRecent().args[0]).toBe('challenges/' + mockChallenge._id);
      }));

      it('should set scope.error if save error', function () {
        var errorMessage = 'this is an error message';
        $httpBackend.expectPOST('api/challenges', sampleChallengePostData).respond(400, {
          message: errorMessage
        });

        scope.create(true);
        $httpBackend.flush();

        expect(scope.error).toBe(errorMessage);
      });
    });

    describe('$scope.update()', function () {
      beforeEach(function () {
        // Mock challenges in scope
        scope.challenge = mockChallenge;
      });

      it('should update a valid challenges', inject(function (Challenges) {
        // Set PUT response
        $httpBackend.expectPUT(/api\/challenges\/([0-9a-fA-F]{24})$/).respond();

        // Run controller functionality
        scope.update(true);
        $httpBackend.flush();

        // Test URL location to new object
        expect($location.path()).toBe('/challenges/' + mockChallenge._id);
      }));

      it('should set scope.error to error response message', inject(function (Challenges) {
        var errorMessage = 'error';
        $httpBackend.expectPUT(/api\/challenges\/([0-9a-fA-F]{24})$/).respond(400, {
          message: errorMessage
        });

        scope.update(true);
        $httpBackend.flush();

        expect(scope.error).toBe(errorMessage);
      }));
    });

    describe('$scope.remove(challenges)', function () {
      beforeEach(function () {
        // Create new challenges array and include the challenges
        scope.challenges = [mockChallenge, {}];

        // Set expected DELETE response
        $httpBackend.expectDELETE(/api\/challenges\/([0-9a-fA-F]{24})$/).respond(204);

        // Run controller functionality
        scope.remove(mockChallenge);
      });

      it('should send a DELETE request with a valid challengeId and remove the challenges from the scope', inject(function (Challenges) {
        expect(scope.challenges.length).toBe(1);
      }));
    });

    describe('scope.remove()', function () {
      beforeEach(function () {
        spyOn($location, 'path');
        scope.challenge = mockChallenge;

        $httpBackend.expectDELETE(/api\/challenges\/([0-9a-fA-F]{24})$/).respond(204);

        scope.remove();
        $httpBackend.flush();
      });

      it('should redirect to challenges', function () {
        expect($location.path).toHaveBeenCalledWith('challenges');
      });
    });
  });
}());
