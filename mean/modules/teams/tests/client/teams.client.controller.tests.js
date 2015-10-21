'use strict';

(function () {
  // Teams Controller Spec
  describe('Teams Controller Tests', function () {
    // Initialize global variables
    var TeamsController,
      scope,
      $httpBackend,
      $stateParams,
      $location,
      Authentication,
      Teams,
      mockTeam;

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
    beforeEach(inject(function ($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_, _Authentication_, _Teams_) {
      // Set a new global scope
      scope = $rootScope.$new();

      // Point global variables to injected services
      $stateParams = _$stateParams_;
      $httpBackend = _$httpBackend_;
      $location = _$location_;
      Authentication = _Authentication_;
      Teams = _Teams_;

      // create mock team
      mockTeam = new Teams({
        _id: '525a8422f6d0f87f0e407a33',
        title: 'An Team about MEAN',
        content: 'MEAN rocks!'
      });

      // Mock logged in user
      Authentication.user = {
        roles: ['user']
      };

      // Initialize the Teams controller.
      TeamsController = $controller('TeamsController', {
        $scope: scope
      });
    }));

    it('$scope.find() should create an array with at least one team object fetched from XHR', inject(function (Teams) {
      // Create a sample teams array that includes the new team
      var sampleTeams = [mockTeam];

      // Set GET response
      $httpBackend.expectGET('api/teams').respond(sampleTeams);

      // Run controller functionality
      scope.find();
      $httpBackend.flush();

      // Test scope value
      expect(scope.teams).toEqualData(sampleTeams);
    }));

    it('$scope.findOne() should create an array with one team object fetched from XHR using a teamId URL parameter', inject(function (Teams) {
      // Set the URL parameter
      $stateParams.teamId = mockTeam._id;

      // Set GET response
      $httpBackend.expectGET(/api\/teams\/([0-9a-fA-F]{24})$/).respond(mockTeam);

      // Run controller functionality
      scope.findOne();
      $httpBackend.flush();

      // Test scope value
      expect(scope.team).toEqualData(mockTeam);
    }));

    describe('$scope.create()', function () {
      var sampleTeamPostData;

      beforeEach(function () {
        // Create a sample team object
        sampleTeamPostData = new Teams({
          title: 'An Team about MEAN',
          content: 'MEAN rocks!'
        });

        // Fixture mock form input values
        scope.title = 'An Team about MEAN';
        scope.content = 'MEAN rocks!';

        spyOn($location, 'path');
      });

      it('should send a POST request with the form input values and then locate to new object URL', inject(function (Teams) {
        // Set POST response
        $httpBackend.expectPOST('api/teams', sampleTeamPostData).respond(mockTeam);

        // Run controller functionality
        scope.create(true);
        $httpBackend.flush();

        // Test form inputs are reset
        expect(scope.title).toEqual('');
        expect(scope.content).toEqual('');

        // Test URL redirection after the team was created
        expect($location.path.calls.mostRecent().args[0]).toBe('teams/' + mockTeam._id);
      }));

      it('should set scope.error if save error', function () {
        var errorMessage = 'this is an error message';
        $httpBackend.expectPOST('api/teams', sampleTeamPostData).respond(400, {
          message: errorMessage
        });

        scope.create(true);
        $httpBackend.flush();

        expect(scope.error).toBe(errorMessage);
      });
    });

    describe('$scope.update()', function () {
      beforeEach(function () {
        // Mock team in scope
        scope.team = mockTeam;
      });

      it('should update a valid team', inject(function (Teams) {
        // Set PUT response
        $httpBackend.expectPUT(/api\/teams\/([0-9a-fA-F]{24})$/).respond();

        // Run controller functionality
        scope.update(true);
        $httpBackend.flush();

        // Test URL location to new object
        expect($location.path()).toBe('/teams/' + mockTeam._id);
      }));

      it('should set scope.error to error response message', inject(function (Teams) {
        var errorMessage = 'error';
        $httpBackend.expectPUT(/api\/teams\/([0-9a-fA-F]{24})$/).respond(400, {
          message: errorMessage
        });

        scope.update(true);
        $httpBackend.flush();

        expect(scope.error).toBe(errorMessage);
      }));
    });

    describe('$scope.remove(team)', function () {
      beforeEach(function () {
        // Create new teams array and include the team
        scope.teams = [mockTeam, {}];

        // Set expected DELETE response
        $httpBackend.expectDELETE(/api\/teams\/([0-9a-fA-F]{24})$/).respond(204);

        // Run controller functionality
        scope.remove(mockTeam);
      });

      it('should send a DELETE request with a valid teamId and remove the team from the scope', inject(function (Teams) {
        expect(scope.teams.length).toBe(1);
      }));
    });

    describe('scope.remove()', function () {
      beforeEach(function () {
        spyOn($location, 'path');
        scope.team = mockTeam;

        $httpBackend.expectDELETE(/api\/teams\/([0-9a-fA-F]{24})$/).respond(204);

        scope.remove();
        $httpBackend.flush();
      });

      it('should redirect to teams', function () {
        expect($location.path).toHaveBeenCalledWith('teams');
      });
    });
  });
}());
