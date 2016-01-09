'use strict';

(function () {
  // ScoreBoard Controller Spec
  describe('ScoreBoard Controller Tests', function () {
    // Initialize global variables
    var ScoreBoardController,
      scope,
      $httpBackend,
      $stateParams,
      $location,
      Authentication,
      ScoreBoard,
      mockScoreBoard;

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
    beforeEach(inject(function ($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_, _Authentication_, _ScoreBoard_) {
      // Set a new global scope
      scope = $rootScope.$new();

      // Point global variables to injected services
      $stateParams = _$stateParams_;
      $httpBackend = _$httpBackend_;
      $location = _$location_;
      Authentication = _Authentication_;
      ScoreBoard = _ScoreBoard_;

      // create mock scoreBoard
      mockScoreBoard = new ScoreBoard({
        _id: '525a8422f6d0f87f0e407a33',
        title: 'An ScoreBoard about MEAN',
        content: 'MEAN rocks!'
      });

      // Mock logged in user
      Authentication.user = {
        roles: ['user']
      };

      // Initialize the ScoreBoard controller.
      ScoreBoardController = $controller('ScoreBoardController', {
        $scope: scope
      });
    }));

    it('$scope.find() should create an array with at least one scoreBoard object fetched from XHR', inject(function (ScoreBoard) {
      // Create a sample scoreBoard array that includes the new scoreBoard
      var sampleScoreBoard = [mockScoreBoard];

      // Set GET response
      $httpBackend.expectGET('api/scoreBoard').respond(sampleScoreBoard);

      // Run controller functionality
      scope.find();
      $httpBackend.flush();

      // Test scope value
      expect(scope.scoreBoard).toEqualData(sampleScoreBoard);
    }));

    it('$scope.findOne() should create an array with one scoreBoard object fetched from XHR using a scoreBoardId URL parameter', inject(function (ScoreBoard) {
      // Set the URL parameter
      $stateParams.scoreBoardId = mockScoreBoard._id;

      // Set GET response
      $httpBackend.expectGET(/api\/scoreBoard\/([0-9a-fA-F]{24})$/).respond(mockScoreBoard);

      // Run controller functionality
      scope.findOne();
      $httpBackend.flush();

      // Test scope value
      expect(scope.scoreBoard).toEqualData(mockScoreBoard);
    }));

    describe('$scope.create()', function () {
      var sampleScoreBoardPostData;

      beforeEach(function () {
        // Create a sample scoreBoard object
        sampleScoreBoardPostData = new ScoreBoard({
          title: 'An ScoreBoard about MEAN',
          content: 'MEAN rocks!'
        });

        // Fixture mock form input values
        scope.title = 'An ScoreBoard about MEAN';
        scope.content = 'MEAN rocks!';

        spyOn($location, 'path');
      });

      it('should send a POST request with the form input values and then locate to new object URL', inject(function (ScoreBoard) {
        // Set POST response
        $httpBackend.expectPOST('api/scoreBoard', sampleScoreBoardPostData).respond(mockScoreBoard);

        // Run controller functionality
        scope.create(true);
        $httpBackend.flush();

        // Test form inputs are reset
        expect(scope.title).toEqual('');
        expect(scope.content).toEqual('');

        // Test URL redirection after the scoreBoard was created
        expect($location.path.calls.mostRecent().args[0]).toBe('scoreBoard/' + mockScoreBoard._id);
      }));

      it('should set scope.error if save error', function () {
        var errorMessage = 'this is an error message';
        $httpBackend.expectPOST('api/scoreBoard', sampleScoreBoardPostData).respond(400, {
          message: errorMessage
        });

        scope.create(true);
        $httpBackend.flush();

        expect(scope.error).toBe(errorMessage);
      });
    });

    describe('$scope.update()', function () {
      beforeEach(function () {
        // Mock scoreBoard in scope
        scope.scoreBoard = mockScoreBoard;
      });

      it('should update a valid scoreBoard', inject(function (ScoreBoard) {
        // Set PUT response
        $httpBackend.expectPUT(/api\/scoreBoard\/([0-9a-fA-F]{24})$/).respond();

        // Run controller functionality
        scope.update(true);
        $httpBackend.flush();

        // Test URL location to new object
        expect($location.path()).toBe('/scoreBoard/' + mockScoreBoard._id);
      }));

      it('should set scope.error to error response message', inject(function (ScoreBoard) {
        var errorMessage = 'error';
        $httpBackend.expectPUT(/api\/scoreBoard\/([0-9a-fA-F]{24})$/).respond(400, {
          message: errorMessage
        });

        scope.update(true);
        $httpBackend.flush();

        expect(scope.error).toBe(errorMessage);
      }));
    });

    describe('$scope.remove(scoreBoard)', function () {
      beforeEach(function () {
        // Create new scoreBoard array and include the scoreBoard
        scope.scoreBoard = [mockScoreBoard, {}];

        // Set expected DELETE response
        $httpBackend.expectDELETE(/api\/scoreBoard\/([0-9a-fA-F]{24})$/).respond(204);

        // Run controller functionality
        scope.remove(mockScoreBoard);
      });

      it('should send a DELETE request with a valid scoreBoardId and remove the scoreBoard from the scope', inject(function (ScoreBoard) {
        expect(scope.scoreBoard.length).toBe(1);
      }));
    });

    describe('scope.remove()', function () {
      beforeEach(function () {
        spyOn($location, 'path');
        scope.scoreBoard = mockScoreBoard;

        $httpBackend.expectDELETE(/api\/scoreBoard\/([0-9a-fA-F]{24})$/).respond(204);

        scope.remove();
        $httpBackend.flush();
      });

      it('should redirect to scoreBoard', function () {
        expect($location.path).toHaveBeenCalledWith('scoreBoard');
      });
    });
  });
}());
