'use strict';

angular.module('challenges').factory('ChallengeForm', ['$http',
  function ($http) {


        return {
          createForm: function($scope, challenge, types, machines) {

              var fields = [
                {
                  className: 'row',
                  fieldGroup: [
                    {
                      className: 'col-xs-4',
                      type: 'input',
                      key: 'name',
                      templateOptions: {
                        label: 'Name'
                      }
                    },
                    {
                      className: 'col-xs-4',
                      type: 'input',
                      key: 'points',
                      templateOptions: {
                        label: 'Points',
                        type: 'number'
                      }
                    },
                    {
                      className: 'col-xs-4',
                      type: 'input',
                      key: 'category',
                      templateOptions: {
                        label: 'Category'
                      },
                    }
                  ]
                },
                {
                  className: 'row',
                  fieldGroup: [
                    {
                      className: 'col-xs-12',
                      type: 'textarea',
                      key: 'description',
                      templateOptions: {
                        label: 'Description',
                        rows: 15
                      }
                    }
                  ]
                },
                {
                  className: 'row',
                  fieldGroup: [
                    {
                      className: 'col-xs-3',
                      type: 'select',
                      key: 'machine',
                      templateOptions: {
                        label: 'Affected Machine',
                        options: machines
                      }
                    },
                    {
                      className: 'col-xs-3',
                      type: 'select',
                      key: 'type',
                      templateOptions: {
                        onChange: function($viewValue, $modelValue, $scope) {
                          $scope.model.answers = []

                          var formats = types.filter(function (type) {
                            return type.value === $viewValue;
                          })[0].formats

                          $scope.model.format = formats[0]
                          $scope.model.formats = formats
                        },
                        label: 'Challenge Type',
                        options: types
                      }
                    },
                    {
                      className: 'col-xs-3',
                      type: 'select',
                      key: 'format',
                      templateOptions: {
                        onChange: function($viewValue, $modelValue, $scope) {
                          $scope.model.answers = []
                        },
                        label: 'Challenge Format',
                        // options: [],
                      },
                      expressionProperties: {
                        'templateOptions.options': function($viewValue, $modelValue, scope) {
                          return scope.model.formats;
                        }
                      }
                    },
                    {
                      className: 'col-xs-3',
                      type: 'input',
                      key: 'submissions',
                      templateOptions: {
                        label: 'Number Of Submissions',
                        type: 'number'
                      },
                   }
                  ]
                },
                {
                  className: 'row',
                  fieldGroup: [
                    {
                      className: 'col-xs-12',
                      key: 'answers',
                      type: 'multiInput',
                      templateOptions: {
                        label: 'Answers',
                        inputOptions: {
                          type: 'input'
                        }
                      },
                      expressionProperties: {
                        'templateOptions.disabled': 'model.format === checkbox'
                      }
                    }
                  ]
                },
              ]
              return fields
          }
        }
      }
    ]);
