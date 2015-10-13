'use strict';

(function () {
  // Challengeboards Controller Spec
  describe('Challengeboards Controller Tests', function () {
    // Initialize global variables
    var ChallengeboardsController,
      scope,
      $httpBackend,
      $stateParams,
      $location,
      Authentication,
      Challengeboards,
      mockChallengeboard;

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
    beforeEach(inject(function ($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_, _Authentication_, _Challengeboards_) {
      // Set a new global scope
      scope = $rootScope.$new();

      // Point global variables to injected services
      $stateParams = _$stateParams_;
      $httpBackend = _$httpBackend_;
      $location = _$location_;
      Authentication = _Authentication_;
      Challengeboards = _Challengeboards_;

      // create mock challengeboards
      mockChallengeboard = new Challengeboards({
        _id: '525a8422f6d0f87f0e407a33',
        title: 'An Challengeboard about MEAN',
        content: 'MEAN rocks!'
      });

      // Mock logged in user
      Authentication.user = {
        roles: ['user']
      };

      // Initialize the Challengeboards controller.
      ChallengeboardsController = $controller('ChallengeboardsController', {
        $scope: scope
      });
    }));

    it('$scope.find() should create an array with at least one challengeboards object fetched from XHR', inject(function (Challengeboards) {
      // Create a sample challengeboards array that includes the new challengeboards
      var sampleChallengeboards = [mockChallengeboard];

      // Set GET response
      $httpBackend.expectGET('api/challengeboards').respond(sampleChallengeboards);

      // Run controller functionality
      scope.find();
      $httpBackend.flush();

      // Test scope value
      expect(scope.challengeboards).toEqualData(sampleChallengeboards);
    }));

    it('$scope.findOne() should create an array with one challengeboards object fetched from XHR using a challengeboardId URL parameter', inject(function (Challengeboards) {
      // Set the URL parameter
      $stateParams.challengeboardId = mockChallengeboard._id;

      // Set GET response
      $httpBackend.expectGET(/api\/challengeboards\/([0-9a-fA-F]{24})$/).respond(mockChallengeboard);

      // Run controller functionality
      scope.findOne();
      $httpBackend.flush();

      // Test scope value
      expect(scope.challengeboard).toEqualData(mockChallengeboard);
    }));

    describe('$scope.create()', function () {
      var sampleChallengeboardPostData;

      beforeEach(function () {
        // Create a sample challengeboards object
        sampleChallengeboardPostData = new Challengeboards({
          title: 'An Challengeboard about MEAN',
          content: 'MEAN rocks!'
        });

        // Fixture mock form input values
        scope.title = 'An Challengeboard about MEAN';
        scope.content = 'MEAN rocks!';

        spyOn($location, 'path');
      });

      it('should send a POST request with the form input values and then locate to new object URL', inject(function (Challengeboards) {
        // Set POST response
        $httpBackend.expectPOST('api/challengeboards', sampleChallengeboardPostData).respond(mockChallengeboard);

        // Run controller functionality
        scope.create(true);
        $httpBackend.flush();

        // Test form inputs are reset
        expect(scope.title).toEqual('');
        expect(scope.content).toEqual('');

        // Test URL redirection after the challengeboards was created
        expect($location.path.calls.mostRecent().args[0]).toBe('challengeboards/' + mockChallengeboard._id);
      }));

      it('should set scope.error if save error', function () {
        var errorMessage = 'this is an error message';
        $httpBackend.expectPOST('api/challengeboards', sampleChallengeboardPostData).respond(400, {
          message: errorMessage
        });

        scope.create(true);
        $httpBackend.flush();

        expect(scope.error).toBe(errorMessage);
      });
    });

    describe('$scope.update()', function () {
      beforeEach(function () {
        // Mock challengeboards in scope
        scope.challengeboard = mockChallengeboard;
      });

      it('should update a valid challengeboards', inject(function (Challengeboards) {
        // Set PUT response
        $httpBackend.expectPUT(/api\/challengeboards\/([0-9a-fA-F]{24})$/).respond();

        // Run controller functionality
        scope.update(true);
        $httpBackend.flush();

        // Test URL location to new object
        expect($location.path()).toBe('/challengeboards/' + mockChallengeboard._id);
      }));

      it('should set scope.error to error response message', inject(function (Challengeboards) {
        var errorMessage = 'error';
        $httpBackend.expectPUT(/api\/challengeboards\/([0-9a-fA-F]{24})$/).respond(400, {
          message: errorMessage
        });

        scope.update(true);
        $httpBackend.flush();

        expect(scope.error).toBe(errorMessage);
      }));
    });

    describe('$scope.remove(challengeboards)', function () {
      beforeEach(function () {
        // Create new challengeboards array and include the challengeboards
        scope.challengeboards = [mockChallengeboard, {}];

        // Set expected DELETE response
        $httpBackend.expectDELETE(/api\/challengeboards\/([0-9a-fA-F]{24})$/).respond(204);

        // Run controller functionality
        scope.remove(mockChallengeboard);
      });

      it('should send a DELETE request with a valid challengeboardId and remove the challengeboards from the scope', inject(function (Challengeboards) {
        expect(scope.challengeboards.length).toBe(1);
      }));
    });

    describe('scope.remove()', function () {
      beforeEach(function () {
        spyOn($location, 'path');
        scope.challengeboard = mockChallengeboard;

        $httpBackend.expectDELETE(/api\/challengeboards\/([0-9a-fA-F]{24})$/).respond(204);

        scope.remove();
        $httpBackend.flush();
      });

      it('should redirect to challengeboards', function () {
        expect($location.path).toHaveBeenCalledWith('challengeboards');
      });
    });
  });
}());
