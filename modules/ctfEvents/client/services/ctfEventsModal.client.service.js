angular.module('ctfEvents').factory('ModalService', ['$animate', '$document', '$compile', '$controller', '$http',
  '$rootScope', '$q', '$templateRequest', '$timeout', function ($animate, $document, $compile, $controller, $http,
                                                                $rootScope, $q, $templateRequest, $timeout) {
    var body = angular.element($document[0].body);
    function ModalService() {
      var self = this;
      var getTemplate = function (template, templateUrl) {
        var deferred = $q.defer();
        if(template) {
          deferred.resolve(template);
        } else if(templateUrl) {
          $templateRequest(templateUrl, true).then(function (template) {
            deferred.resolve(template);
          }, function (error) {
            deferred.reject(error);
          });
        } else {
          deferred.reject('No template or templateUrl has been specified.');
        }
        return deferred.promise;
      };

      var appendChild = function (parent, child) {
        var children = parent.children();
        if(children.length > 0) {
          return $animate.enter(child, parent, children[children.length - 1]);
        }
        return $animate.enter(child, parent);
      };
      self.showModal = function (options) {
        var deferred = $q.defer();
        var controllerName = options.controller;
        if(!controllerName) {
          deferred.reject('No controller has been specified.');
          return deferred.promise;
        }
        getTemplate(options.template, options.templateUrl).then(function (template) {
          var modalScope = (options.scope || $rootScope).$new();
          var closeDeferred = $q.defer();
          var closedDeferred = $q.defer();
          var inputs = {
            $scope: modalScope,
            close: function (result, delay) {
              if(delay === undefined || delay === null) delay = 0;
              $timeout(function () {
                closeDeferred.resolve(result);
                $animate.leave(modalElement).then(function () {
                  closedDeferred.resolve(result);
                  modalScope.$destroy();
                  inputs.close = null;
                  deferred = null;
                  closeDeferred = null;
                  modal = null;
                  inputs = null;
                  modalElement = null;
                  modalScope = null;
                });
              }, delay);
            }
          };
          if(options.inputs) angular.extend(inputs, options.inputs);
          var linkFn = $compile(template);
          var modalElement = linkFn(modalScope);
          inputs.$element = modalElement;
          var controllerObjBefore = modalScope[options.controllerAs];
          var modalController = $controller(options.controller, inputs, false, options.controllerAs);
          if(options.controllerAs && controllerObjBefore) {
            angular.extend(modalController, controllerObjBefore);
          }
          if(options.appendElement) {
            appendChild(options.appendElement, modalElement);
          } else {
            appendChild(body, modalElement);
          }
          var modal = {
            controller: modalController,
            scope: modalScope,
            element: modalElement,
            close: closeDeferred.promise,
            closed: closedDeferred.promise
          };
          deferred.resolve(modal);
        }).then(null, function (error) {
          deferred.reject(error);
        });
        return deferred.promise;
      };
    }
    return new ModalService();
  }
]);
