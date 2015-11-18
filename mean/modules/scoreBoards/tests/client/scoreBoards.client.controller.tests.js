'use strict';

(function () {
  // ScoreBoards Controller Spec
  describe('ScoreBoards Controller Tests', function () {
    // Initialize global variables
    var ScoreBoardsController,
      scope,
      $httpBackend,
      $stateParams,
      $location,
      Authentication,
      ScoreBoards,
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
    beforeEach(inject(function ($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_, _Authentication_, _ScoreBoards_) {
      // Set a new global scope
      scope = $rootScope.$new();

      // Point global variables to injected services
      $stateParams = _$stateParams_;
      $httpBackend = _$httpBackend_;
      $location = _$location_;
      Authentication = _Authentication_;
      ScoreBoards = _ScoreBoards_;

      // create mock scoreBoard
      mockScoreBoard = new ScoreBoards({
        _id: '525a8422f6d0f87f0e407a33',
        title: 'An ScoreBoard about MEAN',
        content: 'MEAN rocks!'
      });

      // Mock logged in user
      Authentication.user = {
        roles: ['user']
      };

      // Initialize the ScoreBoards controller.
      ScoreBoardsController = $controller('ScoreBoardsController', {
        $scope: scope
      });
    }));

    it('$scope.find() should create an array with at least one scoreBoard object fetched from XHR', inject(function (ScoreBoards) {
      // Create a sample scoreBoards array that includes the new scoreBoard
      var sampleScoreBoards = [mockScoreBoard];

      // Set GET response
      $httpBackend.expectGET('api/scoreBoards').respond(sampleScoreBoards);

      // Run controller functionality
      scope.find();
      $httpBackend.flush();

      // Test scope value
      expect(scope.scoreBoards).toEqualData(sampleScoreBoards);
    }));

    it('$scope.findOne() should create an array with one scoreBoard object fetched from XHR using a scoreBoardId URL parameter', inject(function (ScoreBoards) {
      // Set the URL parameter
      $stateParams.scoreBoardId = mockScoreBoard._id;

      // Set GET response
      $httpBackend.expectGET(/api\/scoreBoards\/([0-9a-fA-F]{24})$/).respond(mockScoreBoard);

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
        sampleScoreBoardPostData = new ScoreBoards({
          title: 'An ScoreBoard about MEAN',
          content: 'MEAN rocks!'
        });

        // Fixture mock form input values
        scope.title = 'An ScoreBoard about MEAN';
        scope.content = 'MEAN rocks!';

        spyOn($location, 'path');
      });

      it('should send a POST request with the form input values and then locate to new object URL', inject(function (ScoreBoards) {
        // Set POST response
        $httpBackend.expectPOST('api/scoreBoards', sampleScoreBoardPostData).respond(mockScoreBoard);

        // Run controller functionality
        scope.create(true);
        $httpBackend.flush();

        // Test form inputs are reset
        expect(scope.title).toEqual('');
        expect(scope.content).toEqual('');

        // Test URL redirection after the scoreBoard was created
        expect($location.path.calls.mostRecent().args[0]).toBe('scoreBoards/' + mockScoreBoard._id);
      }));

      it('should set scope.error if save error', function () {
        var errorMessage = 'this is an error message';
        $httpBackend.expectPOST('api/scoreBoards', sampleScoreBoardPostData).respond(400, {
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

      it('should update a valid scoreBoard', inject(function (ScoreBoards) {
        // Set PUT response
        $httpBackend.expectPUT(/api\/scoreBoards\/([0-9a-fA-F]{24})$/).respond();

        // Run controller functionality
        scope.update(true);
        $httpBackend.flush();

        // Test URL location to new object
        expect($location.path()).toBe('/scoreBoards/' + mockScoreBoard._id);
      }));

      it('should set scope.error to error response message', inject(function (ScoreBoards) {
        var errorMessage = 'error';
        $httpBackend.expectPUT(/api\/scoreBoards\/([0-9a-fA-F]{24})$/).respond(400, {
          message: errorMessage
        });

        scope.update(true);
        $httpBackend.flush();

        expect(scope.error).toBe(errorMessage);
      }));
    });

    describe('$scope.remove(scoreBoard)', function () {
      beforeEach(function () {
        // Create new scoreBoards array and include the scoreBoard
        scope.scoreBoards = [mockScoreBoard, {}];

        // Set expected DELETE response
        $httpBackend.expectDELETE(/api\/scoreBoards\/([0-9a-fA-F]{24})$/).respond(204);

        // Run controller functionality
        scope.remove(mockScoreBoard);
      });

      it('should send a DELETE request with a valid scoreBoardId and remove the scoreBoard from the scope', inject(function (ScoreBoards) {
        expect(scope.scoreBoards.length).toBe(1);
      }));
    });

    describe('scope.remove()', function () {
      beforeEach(function () {
        spyOn($location, 'path');
        scope.scoreBoard = mockScoreBoard;

        $httpBackend.expectDELETE(/api\/scoreBoards\/([0-9a-fA-F]{24})$/).respond(204);

        scope.remove();
        $httpBackend.flush();
      });

      it('should redirect to scoreBoards', function () {
        expect($location.path).toHaveBeenCalledWith('scoreBoards');
      });
    });
  });
}());
