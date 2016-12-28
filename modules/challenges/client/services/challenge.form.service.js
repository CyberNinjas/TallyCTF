'use strict';

angular.module('challenges').factory('ChallengeForm', ['$http',
  function ($http) {


        return {
          createForm: function(model, challenge, types, machines) {
            var formats = types.filter(function (type) {
              return type.value === model.type;
            })[0].formats

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
                      className: 'col-xs-4',
                      type: 'select',
                      key: 'machine',
                      templateOptions: {
                        label: 'Affected Machine',
                        options: machines
                      }
                    },
                    {
                      className: 'col-xs-4',
                      type: 'select',
                      key: 'type',
                      templateOptions: {
                        label: 'Challenge Type',
                        options: types
                      }
                    },
                    {
                      className: 'col-xs-4',
                      type: 'select',
                      key: 'format',
                      templateOptions: {
                        label: 'Challenge Format',
                        options: formats,
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
