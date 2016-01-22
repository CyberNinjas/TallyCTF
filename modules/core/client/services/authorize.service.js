'use strict';

/**
 * @ngdoc service
 * @name core.AuthorizeService
 * @description
 * # AuthorizeService
 * Service in the core.
 */
angular.module('core')
  .service('AuthorizeService', function($q, Authentication) {
    var self = this;
    /**
     * isAuthorizedForOne - Takes an array of roles, and lets you know if the user has at least one permission
     *                      from the array
     * @param rolesRequiredToHave - An array of titles for roles e.g. [DISSEMINATE_FILING]
     * @returns {deferred.promise|{then, always}} - True/resolve if authorized, false/rejected if access not granted
     */
    this.isAuthorizedForOne = function(rolesRequiredToHave){
      var deferred = $q.defer();
      if(!rolesRequiredToHave) {//If not set, or set to false, then no perms required so say yes
        deferred.resolve(true);
        return deferred.promise; //Skip out, 'cuz no perms needed
      }

      var user = Authentication.user;
      //If perms set but user is false or not set, doesn't have perms so fail. This is also true if no perms param
      if (!user || !user.roles)
        deferred.reject(false)
      else {//Else cycle through perms and see if he has one.
        for (var role in rolesRequiredToHave) {
          if (user.roles.indexOf(rolesRequiredToHave[role]) >= 0) {
            deferred.resolve(true);
            return deferred.promise;
          }
        }
        deferred.reject(false);//If not returned, than had none, so return reject
      }
      return deferred.promise;
    }

    /**
     * isAuthorizedForAll - Takes an array of roles, and lets you know if the user has all roles
     *                      from the array
     * @param rolesRequiredToHave - An array of titles for roles e.g. [DISSEMINATE_FILING]
     * @returns {deferred.promise|{then, always}} - True/resolve if authorized, false/rejected if access not granted
     */
    this.isAuthorizedForAll = function(rolesRequiredToHave){
      var deferred = $q.defer();
      if(!rolesRequiredToHave) {//If not set, or set to false, then no perms required so say yes
        deferred.resolve(true);
        return deferred.promise; //Skip out, 'cuz no perms needed
      }

      var user = Authentication.user;
      //If perms set but user is false or not set, doesn't have perms so fail. This is also true if no perms param
      if (!user || !user.roles)
        deferred.reject(false)
      else {//Else cycle through perms and see if he has one.
        for (var role in rolesRequiredToHave) {
          if (user.roles.indexOf(rolesRequiredToHave[role]) < 0) {
            deferred.reject(false);
            return deferred.promise;
          }
        }
        deferred.resolve(true);//If not returned, than had none, so return reject
      }
      return deferred.promise;
    }
  });
