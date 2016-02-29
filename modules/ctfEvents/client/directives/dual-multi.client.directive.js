angular.module('ctfEvents').directive('dualMulti', [function(){
  return {
    restrict: 'E',
    scope: {
      options: '='
    },
    controller: function($scope, $filter) {
      $scope.transfer = function(to,from, index) {
        if (index >= 0) {
          to.push(from[index]);
          from.splice(index, 1);
        } else {
          for (var i = 0; i < from.length; i++) {
            to.push(from[i]);
          }
          from.length = 0;
        }
      };
    },
    template: '<div class="dualmultiselect">'+
                '<div class="row">'+
                  '<div class="col-lg-offset-3 col-lg-6 col-md-offset-3 col-md-6 col-sm-12">'+
                    '<h4 class="text-center">{{options.title}}'+
                      '<small>&nbsp; Click items to transfer them between fields.</small>'+
                    '</h4> '+
                    '<input class="form-control" placeholder="Start typing to filter the {{options.title|lowercase}} below" ng-model="searchTerm">' +
                  '</div>'+
                '</div>'+
              '<div class="row">'+
                '<div class="col-lg-6 col-md-6 col-sm-6"> '+
                  '<label>Available {{options.title}}</label>' +
                    '<button type="button" class="btn btn-success btn-xs" ng-click="transfer(options.selectedItems, options.items, -1)"> Select All </button> '+
                    '<div class="well trim-well">'+
                      '<div class="list-group flow"> '+
                      '<a class="list-group-item" ng-repeat="item in options.items | filter: searchTerm" ng-click="transfer(options.selectedItems,options.items, options.items.indexOf(item))">{{item[options.display]}}</a>' +
                    '</div>'+
                  '</div>'+
                '</div>'+
                '<div class="col-lg-6 col-md-6 col-sm-6">'+
                  '<label>Selected {{options.title}}</label>'+
                  '<button type="button" class="btn btn-warning btn-xs" ng-click="transfer(options.items, options.selectedItems, -1)"> Deselect All </button>'+
                  '<div class="well trim-well">'+
                    '<div class="listgroup flow">'+
                      '<a class="list-group-item" ng-repeat="item in options.selectedItems" ng-click="transfer(options.items, options.selectedItems, options.selectedItems.indexOf(item))"> {{item[options.display]}} </a>'+
                    '</div>'+
                  '</div>'+
                '</div>'+
              '</div>'
  }
}]);
