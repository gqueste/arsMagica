angular.module('arsMagica', ['ngRoute'], function($httpProvider){
  //Code from zeke : http://victorblog.com/2012/12/20/make-angularjs-http-service-behave-like-jquery-ajax/
  // Use x-www-form-urlencoded Content-Type
  $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
 
  /**
   * The workhorse; converts an object to x-www-form-urlencoded serialization.
   * @param {Object} obj
   * @return {String}
   */
  var param = function(obj) {
    var query = '', name, value, fullSubName, subName, subValue, innerObj, i;
      
    for(name in obj) {
      value = obj[name];
        
      if(value instanceof Array) {
        for(i=0; i<value.length; ++i) {
          subValue = value[i];
          fullSubName = name + '[' + i + ']';
          innerObj = {};
          innerObj[fullSubName] = subValue;
          query += param(innerObj) + '&';
        }
      }
      else if(value instanceof Object) {
        for(subName in value) {
          subValue = value[subName];
          fullSubName = name + '[' + subName + ']';
          innerObj = {};
          innerObj[fullSubName] = subValue;
          query += param(innerObj) + '&';
        }
      }
      else if(value !== undefined && value !== null)
        query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
    }
      
    return query.length ? query.substr(0, query.length - 1) : query;
  };
 
  // Override $http service's default transformRequest
  $httpProvider.defaults.transformRequest = [function(data) {
    return angular.isObject(data) && String(data) !== '[object File]' ? param(data) : data;
  }];
})

.config(function($routeProvider) {
  $routeProvider
    .when('/', {
      controller:'AccueilCtrl',
      templateUrl:'./accueil.html'
    })
    .when('/create/:typePersonnage', {
      controller:'CreateCtrl',
      templateUrl:'./create.html'
    })
    .when('/create/:typePersonnage/:maison', {
      controller:'VertuCtrl',
      templateUrl:'./vertu.html'
    })
    .otherwise({
      redirectTo:'/'
    });
})

.controller('AccueilCtrl', function($scope, $http) {
  $scope.chooseType = function() {
    var typeRecupere = $('#type_character_select option:selected').val();
    window.location.replace("#/create/"+typeRecupere);
  };
})

.controller('CreateCtrl', function($scope, $routeParams, $http) {
  $scope.typePersonnage = $routeParams.typePersonnage;

  $scope.maison = function() {
    var maison = $('#select_maison option:selected').val();
    window.location.replace("#/create/"+$scope.typePersonnage+"/"+maison);
  }
})

.controller('VertuCtrl', function($scope, $routeParams, $http) {
  $scope.typePersonnage = $routeParams.typePersonnage;
  $scope.maison = $routeParams.maison;
});

