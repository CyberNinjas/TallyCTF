'use strict';

angular.module('challenges').factory('ChallengeForm', ['$http',
  function ($http) {

    return {
      createForm: function ($scope, challenge, types, machines, nice) {
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
                  label: 'Display Category'
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
                  rows: 10
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
                  onChange: function ($viewValue, $modelValue, $scope) {
                    $scope.model.answers = []

                    var formats = types.filter(function (type) {
                      return type.value === $viewValue;
                    })[0].formats

                    $scope.model.format = formats[0].value
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
                  onChange: function ($viewValue, $modelValue, $scope) {
                    $scope.model.answers = []
                    if($scope.model.format == 'radio'){
                      $scope.model.answers = [
                        { value: 'true', correct: true, regex: false },
                        { value: 'false', correct: false, regex: false }
                      ]
                    }
                  },
                  label: 'Challenge Format',
                },
                expressionProperties: {
                  'templateOptions.options': function ($viewValue, $modelValue, scope) {
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
                type: 'multiselect',
                key: 'nice',
                templateOptions: {
                  "label": "NICE Framework",
                  "valueProp": "name",
                  "options": nice,
                }
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
                  type: 'password',
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
