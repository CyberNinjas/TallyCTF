'use strict';

(function () {
  // CtfEvents Controller Spec
  describe('CtfEvents Controller Tests', function () {
    // Initialize global variables
    var CtfEventsController,
      scope,
      $httpBackend,
      $stateParams,
      $location,
      Authentication,
      CtfEvents,
      mockCtfEvent;

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
    beforeEach(inject(function ($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_, _Authentication_, _CtfEvents_) {
      // Set a new global scope
      scope = $rootScope.$new();

      // Point global variables to injected services
      $stateParams = _$stateParams_;
      $httpBackend = _$httpBackend_;
      $location = _$location_;
      Authentication = _Authentication_;
      CtfEvents = _CtfEvents_;

      // create mock ctfEvent
      mockCtfEvent = new CtfEvents({
        _id: '525a8422f6d0f87f0e407a33',
        title: 'An CtfEvent about MEAN',
        content: 'MEAN rocks!'
      });

      // Mock logged in user
      Authentication.user = {
        roles: ['user']
      };

      // Initialize the CtfEvents controller.
      CtfEventsController = $controller('CtfEventsController', {
        $scope: scope
      });
    }));

    it('$scope.find() should create an array with at least one ctfEvent object fetched from XHR', inject(function (CtfEvents) {
      // Create a sample ctfEvents array that includes the new ctfEvent
      var sampleCtfEvents = [mockCtfEvent];

      // Set GET response
      $httpBackend.expectGET('api/ctfEvents').respond(sampleCtfEvents);

      // Run controller functionality
      scope.find();
      $httpBackend.flush();

      // Test scope value
      expect(scope.ctfEvents).toEqualData(sampleCtfEvents);
    }));

    it('$scope.findOne() should create an array with one ctfEvent object fetched from XHR using a ctfEventId URL parameter', inject(function (CtfEvents) {
      // Set the URL parameter
      $stateParams.ctfEventId = mockCtfEvent._id;

      // Set GET response
      $httpBackend.expectGET(/api\/ctfEvents\/([0-9a-fA-F]{24})$/).respond(mockCtfEvent);

      // Run controller functionality
      scope.findOne();
      $httpBackend.flush();

      // Test scope value
      expect(scope.ctfEvent).toEqualData(mockCtfEvent);
    }));

    describe('$scope.create()', function () {
      var sampleCtfEventPostData;

      beforeEach(function () {
        // Create a sample ctfEvent object
        sampleCtfEventPostData = new CtfEvents({
          title: 'An CtfEvent about MEAN',
          content: 'MEAN rocks!'
        });

        // Fixture mock form input values
        scope.title = 'An CtfEvent about MEAN';
        scope.content = 'MEAN rocks!';

        spyOn($location, 'path');
      });

      it('should send a POST request with the form input values and then locate to new object URL', inject(function (CtfEvents) {
        // Set POST response
        $httpBackend.expectPOST('api/ctfEvents', sampleCtfEventPostData).respond(mockCtfEvent);

        // Run controller functionality
        scope.create(true);
        $httpBackend.flush();

        // Test form inputs are reset
        expect(scope.title).toEqual('');
        expect(scope.content).toEqual('');

        // Test URL redirection after the ctfEvent was created
        expect($location.path.calls.mostRecent().args[0]).toBe('ctfEvents/' + mockCtfEvent._id);
      }));

      it('should set scope.error if save error', function () {
        var errorMessage = 'this is an error message';
        $httpBackend.expectPOST('api/ctfEvents', sampleCtfEventPostData).respond(400, {
          message: errorMessage
        });

        scope.create(true);
        $httpBackend.flush();

        expect(scope.error).toBe(errorMessage);
      });
    });

    describe('$scope.update()', function () {
      beforeEach(function () {
        // Mock ctfEvent in scope
        scope.ctfEvent = mockCtfEvent;
      });

      it('should update a valid ctfEvent', inject(function (CtfEvents) {
        // Set PUT response
        $httpBackend.expectPUT(/api\/ctfEvents\/([0-9a-fA-F]{24})$/).respond();

        // Run controller functionality
        scope.update(true);
        $httpBackend.flush();

        // Test URL location to new object
        expect($location.path()).toBe('/ctfEvents/' + mockCtfEvent._id);
      }));

      it('should set scope.error to error response message', inject(function (CtfEvents) {
        var errorMessage = 'error';
        $httpBackend.expectPUT(/api\/ctfEvents\/([0-9a-fA-F]{24})$/).respond(400, {
          message: errorMessage
        });

        scope.update(true);
        $httpBackend.flush();

        expect(scope.error).toBe(errorMessage);
      }));
    });

    describe('$scope.remove(ctfEvent)', function () {
      beforeEach(function () {
        // Create new ctfEvents array and include the ctfEvent
        scope.ctfEvents = [mockCtfEvent, {}];

        // Set expected DELETE response
        $httpBackend.expectDELETE(/api\/ctfEvents\/([0-9a-fA-F]{24})$/).respond(204);

        // Run controller functionality
        scope.remove(mockCtfEvent);
      });

      it('should send a DELETE request with a valid ctfEventId and remove the ctfEvent from the scope', inject(function (CtfEvents) {
        expect(scope.ctfEvents.length).toBe(1);
      }));
    });

    describe('scope.remove()', function () {
      beforeEach(function () {
        spyOn($location, 'path');
        scope.ctfEvent = mockCtfEvent;

        $httpBackend.expectDELETE(/api\/ctfEvents\/([0-9a-fA-F]{24})$/).respond(204);

        scope.remove();
        $httpBackend.flush();
      });

      it('should redirect to ctfEvents', function () {
        expect($location.path).toHaveBeenCalledWith('ctfEvents');
      });
    });
  });
}());
