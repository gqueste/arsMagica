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

  //Déclaration Constantes
  $scope.costMajeure = 3;
  $scope.costMineure = 1;
  $scope.noLimit = 50;
  $scope.none = -1;

  //Déclaration variables
  $scope.regles;
  $scope.vertuesDispo;
  $scope.vicesDispo;
  $scope.statutSocialDispo;
  $scope.statutSocialNecessaire;
  $scope.vicesHistoireDispo ;
  $scope.vicesPersonnaliteDispo ;
  $scope.vicesPersonnaliteMajeurDispo ;
  $scope.vertusMajeuresDispo ;
  $scope.vicesMajeursDispo ;
  $scope.vertuesHermetiquesDispo ;
  $scope.vertuesHermetiquesMajeuresDispo ;
  $scope.vicesHermetiquesDispo ;
  $scope.vicesHermetiquesNecessaires;
  $scope.vicesMineursDispo ;
  $scope.vicesHistoireDispo ;

  //initialisation des variables
  if ($scope.typePersonnage == 'Servant') {
    $scope.regles = [
      {rule:"Vous pouvez prendre jusqu\'à 3 points de Vices et autant de points de Vertues."},
      {rule:"Vous devez prendre un statut social."},
      {rule:"Vous ne pouvez pas prendre de Vice d\'Histoire."},
      {rule:"Vous ne pouvez pas prendre plus d\'un vice de Personnalité."},
      {rule:"Vous ne pouvez pas prendre de Vertus ou de Vices Majeurs."},
      {rule:"Vous ne pouvez pas prendre de Vertus ou de Vices Hermétiques."}
    ];
    $scope.vertuesDispo = 3;
    $scope.vicesDispo = 3;
    $scope.statutSocialDispo = 1;
    $scope.statutSocialNecessaire = 1;
    $scope.vicesHistoireDispo = $scope.none;
    $scope.vicesPersonnaliteDispo = 1;
    $scope.vicesPersonnaliteMajeurDispo = $scope.noLimit;
    $scope.vertusMajeuresDispo = $scope.none;
    $scope.vicesMajeursDispo = $scope.none;
    $scope.vertuesHermetiquesDispo = $scope.none;
    $scope.vertuesHermetiquesMajeuresDispo = $scope.none;
    $scope.vicesHermetiquesDispo = $scope.none;
    $scope.vicesHermetiquesNecessaires = $scope.none;
    $scope.vicesMineursDispo = $scope.noLimit;
    $scope.vicesHistoireDispo = $scope.noLimit;
  }
  else {
    if ($scope.typePersonnage == 'Compagnon') {
      $scope.regles = [
        {rule:"Vous pouvez prendre jusqu\'à 10 points de Vices et autant de points de Vertues."},
        {rule:"Vous ne pouvez pas prendre plus de 5 Vices Mineurs."},
        {rule:"Vous devez prendre au moins un statut social."},
        {rule:"Vous ne pouvez pas prendre plus d\'un Vice d\'Histoire."},
        {rule:"Vous ne pouvez pas prendre plus de 2 Vices de Personnalité, et pas plus d\'un Vice de Personnalité Majeur."},
        {rule:"Vous ne pouvez pas prendre de Vertus ou de Vices Hermétiques."}
      ];
      $scope.vertuesDispo = 10;
      $scope.vicesDispo = 10;
      $scope.statutSocialDispo = $scope.noLimit;
      $scope.statutSocialNecessaire = 1;
      $scope.vicesHistoireDispo = 1;
      $scope.vicesPersonnaliteDispo = 2;
      $scope.vicesPersonnaliteMajeurDispo = 1;
      $scope.vertusMajeuresDispo = $scope.noLimit;
      $scope.vicesMajeursDispo = $scope.noLimit;
      $scope.vertuesHermetiquesDispo = $scope.none;
      $scope.vertuesHermetiquesMajeuresDispo = $scope.none;
      $scope.vicesHermetiquesDispo = $scope.none;
      $scope.vicesHermetiquesNecessaires = $scope.none;
      $scope.vicesMineursDispo = 5;
      $scope.vicesHistoireDispo = 1;
    }
    else { //Mages
       $scope.regles = [
        {rule:"Vous pouvez prendre jusqu\'à 10 points de Vices et autant de points de Vertues."},
        {rule:"Vous ne pouvez pas prendre plus de 5 Vices Mineurs."},
        {rule:"Vous ne pouvez pas prendre plus d\'une Vertue Hermétique Majeure."},
        {rule:"Vous devez prendre au moins un Vice Hermétique."},
        {rule:"Vous ne pouvez pas prendre plus d\'un Vice d\'Histoire."},
        {rule:"Vous ne pouvez pas prendre plus de 2 Vices de Personnalité, et pas plus d\'un Vice de Personnalité Majeur."}
      ];
      $scope.vertuesDispo = 10;
      $scope.vicesDispo = 10;
      $scope.statutSocialDispo = $scope.noLimit;
      $scope.statutSocialNecessaire = 0;
      $scope.vicesHistoireDispo = 1;
      $scope.vicesPersonnaliteDispo = 2;
      $scope.vicesPersonnaliteMajeurDispo = 1;
      $scope.vertusMajeuresDispo = $scope.noLimit;
      $scope.vicesMajeursDispo = $scope.noLimit;
      $scope.vertuesHermetiquesDispo = $scope.noLimit;
      $scope.vertuesHermetiquesMajeuresDispo = 1;
      $scope.vicesHermetiquesDispo = $scope.noLimit;
      $scope.vicesHermetiquesNecessaires = 1;
      $scope.vicesMineursDispo = 5;
      $scope.vicesHistoireDispo = 1;
    }
  }
});
