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
  $http.get('./data/typesPersonnages.json').success(function(data) {
    $scope.typesPersonnages = data;
  });
  $scope.chooseType = function() {
    var typeRecupere = $('#type_character_select option:selected').val();
    window.location.href = "#/create/"+typeRecupere;
  };
})

.controller('CreateCtrl', function($scope, $routeParams, $http) {
  $scope.typePersonnage = $routeParams.typePersonnage;
  $http.get('./data/maisons.json').success(function(data) {
    $scope.maisons = data;
  });

  $scope.maison = function() {
    var maison = $('#select_maison option:selected').val();
    window.location.href = "#/create/"+$scope.typePersonnage+"/"+maison;
  }
})

.filter('requiredFilter', function(){
  return function(items, typePersonnage, maison) {
    var filtered = [];
    angular.forEach(items, function(item) {
      if((item.requiredTypePersonnage == typePersonnage || item.requiredTypePersonnage == '') && (item.requiredMaison == maison || item.requiredMaison == '')) {
        filtered.push(item);
      }
    });
    return filtered;
  };
})

.controller('VertuCtrl', function($scope, $routeParams, $http, $location, $anchorScroll) {
  $scope.typePersonnage = $routeParams.typePersonnage;
  $scope.maison = $routeParams.maison;

  $http.get("./data/vertusHermetiquesMajeures.json").success(function(data) {
    $scope.vertusHermetiquesMajeures = data;
  });
  $http.get("./data/vertusSurnaturellesMajeures.json").success(function(data) {
    $scope.vertusSurnaturellesMajeures = data;
  });
  $http.get("./data/vertusStatutSocialMajeures.json").success(function(data) {
    $scope.vertusStatutSocialMajeures = data;
  });
  $http.get("./data/vertusGeneralesMajeures.json").success(function(data) {
    $scope.vertusGeneralesMajeures = data;
  });
  $http.get("./data/vertusHermetiquesMineures.json").success(function(data) {
    $scope.vertusHermetiquesMineures = data;
  });
  $http.get("./data/vertusSurnaturellesMineures.json").success(function(data) {
    $scope.vertusSurnaturellesMineures = data;
  });
  $http.get("./data/vertusStatutSocialMineures.json").success(function(data) {
    $scope.vertusStatutSocialMineures = data;
  });
  $http.get("./data/vertusGeneralesMineures.json").success(function(data) {
    $scope.vertusGeneralesMineures = data;
  });
  $http.get("./data/vertusStatutSocialGratuites.json").success(function(data) {
    $scope.vertusStatutSocialGratuites = data;
  });

  //Déclaration Constantes
  $scope.costMajeure = 3;
  $scope.costMineure = 1;
  $scope.noLimit = 50;
  $scope.none = -1;
  $scope.avantages = '';

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
  $scope.vicesHermetiquesMajeursNecessaires;
  $scope.vicesHermetiquesNecessaires;
  $scope.vicesMineursDispo ;
  $scope.choixNecessaire;

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
    $scope.vicesHermetiquesMajeursNecessaires = $scope.none;
    $scope.vicesHermetiquesNecessaires = $scope.none;
    $scope.vicesMineursDispo = $scope.noLimit;
    $scope.choixNecessaire = $scope.none;
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
      $scope.statutSocialDispo = 1;
      $scope.statutSocialNecessaire = 1;
      $scope.vicesHistoireDispo = 1;
      $scope.vicesPersonnaliteDispo = 2;
      $scope.vicesPersonnaliteMajeurDispo = 1;
      $scope.vertusMajeuresDispo = $scope.noLimit;
      $scope.vicesMajeursDispo = $scope.noLimit;
      $scope.vertuesHermetiquesDispo = $scope.none;
      $scope.vertuesHermetiquesMajeuresDispo = $scope.none;
      $scope.vicesHermetiquesDispo = $scope.none;
      $scope.vicesHermetiquesMajeursNecessaires = $scope.none;
      $scope.vicesHermetiquesNecessaires = $scope.none;
      $scope.vicesMineursDispo = 5;
      $scope.choixNecessaire = $scope.none;
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
      $scope.statutSocialDispo = 0;
      $scope.statutSocialNecessaire = 0;
      $scope.vicesHistoireDispo = 1;
      $scope.vicesPersonnaliteDispo = 2;
      $scope.vicesPersonnaliteMajeurDispo = 1;
      $scope.vertusMajeuresDispo = $scope.noLimit;
      $scope.vicesMajeursDispo = $scope.noLimit;
      $scope.vertuesHermetiquesDispo = $scope.noLimit;
      $scope.vertuesHermetiquesMajeuresDispo = 1;
      $scope.vicesHermetiquesDispo = $scope.noLimit;
      $scope.vicesHermetiquesMajeursNecessaires = $scope.none;
      $scope.vicesHermetiquesNecessaires = 1;
      $scope.vicesMineursDispo = 5;
      $scope.choixNecessaire = $scope.none;
      if ($scope.maison == 'Ex Miscellanea') {
        $scope.avantages = 'Une Vertu hermétique mineure gratuite, une Vertu non hermétique majeure gratuite et un Vice hermétique majeur obligatoire';
        $scope.vicesHermetiquesMajeursNecessaires = 1;
        $scope.vertuesDispo = $scope.vertuesDispo + $scope.costMineure + $scope.costMajeure;
      }
      else {
        if($scope.maison == 'Guernicus') {
          $scope.avantages = 'Prestige hermétique';
        }
        else {
          if($scope.maison == 'Jerbiton') {
            $scope.avantages = 'Une vertu mineure liée à l\'érudition, aux arts ou aux intéractions vulgaires';
            $scope.vertuesDispo = $scope.vertuesDispo + $scope.costMineure;
          }
          else{
            if($scope.maison == 'Mercere' || $scope.maison=='Flambeau' || $scope.maison=='Bonisagus') {
              $scope.choixNecessaire = 1;
            }
          }
        }
      }
    }
  }

  $scope.handleClickVertuesHermMaj = function(obj) {
    if(obj.target.checked) { //coche
      $scope.vertuesDispo = $scope.vertuesDispo - $scope.costMajeure;
      $scope.vertusMajeuresDispo --;
      $scope.vertuesHermetiquesDispo --;
      $scope.vertuesHermetiquesMajeuresDispo --;
    }
    else{ //decoche
      $scope.vertuesDispo = $scope.vertuesDispo + $scope.costMajeure;
      $scope.vertusMajeuresDispo ++;
      $scope.vertuesHermetiquesDispo ++;
      $scope.vertuesHermetiquesMajeuresDispo ++;
    }
  };
  $scope.handleClickVertuesSurnMaj = function(obj) {
    if(obj.target.checked) { //coche
      $scope.vertuesDispo = $scope.vertuesDispo - $scope.costMajeure;
      $scope.vertusMajeuresDispo --;     
    }
    else{ //decoche
      $scope.vertuesDispo = $scope.vertuesDispo + $scope.costMajeure;
      $scope.vertusMajeuresDispo ++;
    }
  };
  $scope.handleClickVertuesStatutSocMaj = function(obj) {
    if(obj.target.checked) { //coche
      $scope.vertuesDispo = $scope.vertuesDispo - $scope.costMajeure;
      $scope.vertusMajeuresDispo --;
      $scope.statutSocialDispo --;
      $scope.statutSocialNecessaire --;     
    }
    else{ //decoche
      $scope.vertuesDispo = $scope.vertuesDispo + $scope.costMajeure;
      $scope.vertusMajeuresDispo ++;
      $scope.statutSocialDispo ++;
      $scope.statutSocialNecessaire ++;
    }
  };
  $scope.handleClickVertuesGenMaj = function(obj) {
    if(obj.target.checked) { //coche
      $scope.vertuesDispo = $scope.vertuesDispo - $scope.costMajeure;
      $scope.vertusMajeuresDispo --;    
    }
    else{ //decoche
      $scope.vertuesDispo = $scope.vertuesDispo + $scope.costMajeure;
      $scope.vertusMajeuresDispo ++;
    }
  };
  $scope.handleClickVertuesHermMin = function(obj, choixNecessaire) {
    if(obj.target.checked) { //coche
      $scope.vertuesDispo = $scope.vertuesDispo - $scope.costMineure;
      $scope.vertuesHermetiquesDispo --;
      if(choixNecessaire) {
        $scope.choixNecessaire --;
      }
    }
    else{ //decoche
      $scope.vertuesDispo = $scope.vertuesDispo + $scope.costMineure;
      $scope.vertuesHermetiquesDispo ++;
      if(choixNecessaire) {
        $scope.choixNecessaire ++;
      }
    }
  };
  $scope.handleClickVertuesSurnMin = function(obj) {
    if(obj.target.checked) { //coche
      $scope.vertuesDispo = $scope.vertuesDispo - $scope.costMineure;
    }
    else{ //decoche
      $scope.vertuesDispo = $scope.vertuesDispo + $scope.costMineure;
    }
  };
  $scope.handleClickVertuesStatSocMin = function(obj) {
    if(obj.target.checked) { //coche
      $scope.vertuesDispo = $scope.vertuesDispo - $scope.costMineure;
      $scope.statutSocialDispo --;
      $scope.statutSocialNecessaire --;     
    }
    else{ //decoche
      $scope.vertuesDispo = $scope.vertuesDispo + $scope.costMineure;
      $scope.statutSocialDispo ++;
      $scope.statutSocialNecessaire ++;
    }
  };
  $scope.handleClickVertuesGenMin = function(obj, choixNecessaire) {
    if(obj.target.checked) { //coche
      $scope.vertuesDispo = $scope.vertuesDispo - $scope.costMajeure;   
      if(choixNecessaire) {
        $scope.choixNecessaire --;
      }
    }
    else{ //decoche
      $scope.vertuesDispo = $scope.vertuesDispo + $scope.costMajeure;
      if(choixNecessaire) {
        $scope.choixNecessaire ++;
      }
    }
  };
  $scope.handleClickVertuesStatSocGrat = function(obj) {
    if(obj.target.checked) { //coche
      $scope.statutSocialDispo --;
      $scope.statutSocialNecessaire --;     
    }
    else{ //decoche
      $scope.statutSocialDispo ++;
      $scope.statutSocialNecessaire ++;
    }
  };



  //VICES
  $scope.handleClickVicesHermMaj = function(obj) {
    if(obj.target.checked) { //coche
      $scope.vicesDispo = $scope.vicesDispo - $scope.costMajeure;
      $scope.vicesMajeursDispo --;
      $scope.vicesHermetiquesDispo --; 
    }
    else{ //decoche
      $scope.vicesDispo = $scope.vicesDispo + $scope.costMajeure;
      $scope.vicesMajeursDispo ++;
      $scope.vicesHermetiquesDispo ++;
    }
  };
  $scope.handleClickVicesPersMaj = function(obj) {
    if(obj.target.checked) { //coche
      $scope.vicesDispo = $scope.vicesDispo - $scope.costMajeure;
      $scope.vicesMajeursDispo --;
      $scope.vicesPersonnaliteDispo --;
      $scope.vicesPersonnaliteMajeurDispo --; 
    }
    else{ //decoche
      $scope.vicesDispo = $scope.vicesDispo + $scope.costMajeure;
      $scope.vicesPersonnaliteDispo ++;
      $scope.vicesMajeursDispo ++;
      $scope.vicesPersonnaliteMajeurDispo ++;
    }
  };
  $scope.handleClickVicesPersMaj = function(obj) {
    if(obj.target.checked) { //coche
      $scope.vicesDispo = $scope.vicesDispo - $scope.costMajeure;
      $scope.vicesMajeursDispo --;
      $scope.vicesPersonnaliteDispo --;
    }
    else{ //decoche
      $scope.vicesDispo = $scope.vicesDispo + $scope.costMajeure;
      $scope.vicesMajeursDispo ++;
      $scope.vicesPersonnaliteDispo ++;
    }
  };
  $scope.handleClickVicesSSMaj = function(obj) {
    if(obj.target.checked) { //coche
      $scope.vicesDispo = $scope.vicesDispo - $scope.costMajeure;
      $scope.vicesMajeursDispo --;
      $scope.statutSocialDispo --;
    }
    else{ //decoche
      $scope.vicesDispo = $scope.vicesDispo + $scope.costMajeure;
      $scope.vicesMajeursDispo ++;
      $scope.statutSocialDispo ++;
    }
  };
  $scope.handleClickVicesSurMaj = function(obj) {
    if(obj.target.checked) { //coche
      $scope.vicesDispo = $scope.vicesDispo - $scope.costMajeure;
      $scope.vicesMajeursDispo --;
    }
    else{ //decoche
      $scope.vicesDispo = $scope.vicesDispo + $scope.costMajeure;
      $scope.vicesMajeursDispo ++;
    }
  };
  $scope.handleClickVicesGenMaj = function(obj) {
    if(obj.target.checked) { //coche
      $scope.vicesDispo = $scope.vicesDispo - $scope.costMajeure;
      $scope.vicesMajeursDispo --;
    }
    else{ //decoche
      $scope.vicesDispo = $scope.vicesDispo + $scope.costMajeure;
      $scope.vicesMajeursDispo ++;
    }
  };
  $scope.handleClickVicesHermMin = function(obj) {
    if(obj.target.checked) { //coche
      $scope.vicesDispo = $scope.vicesDispo - $scope.costMineure;
      $scope.vicesHermetiquesDispo --;
      $scope.vicesMineursDispo --;
    }
    else{ //decoche
      $scope.vicesDispo = $scope.vicesDispo + $scope.costMineure;
      $scope.vicesHermetiquesDispo ++;
      $scope.vicesMineursDispo ++;
    }
  };
  $scope.handleClickVicesPersMin = function(obj) {
    if(obj.target.checked) { //coche
      $scope.vicesDispo = $scope.vicesDispo - $scope.costMineure;
      $scope.vicesPersonnaliteDispo --;
      $scope.vicesMineursDispo --;
    }
    else{ //decoche
      $scope.vicesDispo = $scope.vicesDispo + $scope.costMineure;
      $scope.vicesPersonnaliteDispo ++;
      $scope.vicesMineursDispo ++;
    }
  };
  $scope.handleClickVicesHistMin = function(obj) {
    if(obj.target.checked) { //coche
      $scope.vicesDispo = $scope.vicesDispo - $scope.costMineure;
      $scope.vicesHistoireDispo --;
      $scope.vicesMineursDispo --;
    }
    else{ //decoche
      $scope.vicesDispo = $scope.vicesDispo + $scope.costMineure;
      $scope.vicesHistoireDispo ++;
      $scope.vicesMineursDispo ++;
    }
  };
  $scope.handleClickVicesStatSocMin = function(obj) {
    if(obj.target.checked) { //coche
      $scope.vicesDispo = $scope.vicesDispo - $scope.costMineure;
      $scope.statutSocialDispo --;
      $scope.vicesMineursDispo --;
    }
    else{ //decoche
      $scope.vicesDispo = $scope.vicesDispo + $scope.costMineure;
      $scope.statutSocialDispo ++;
      $scope.vicesMineursDispo ++;
    }
  };
  $scope.handleClickVicesSurnatMin = function(obj) {
    if(obj.target.checked) { //coche
      $scope.vicesDispo = $scope.vicesDispo - $scope.costMineure;
      $scope.vicesMineursDispo --;
    }
    else{ //decoche
      $scope.vicesDispo = $scope.vicesDispo + $scope.costMineure;
      $scope.vicesMineursDispo ++;
    }
  };









  $scope.scrollTo = function(id) {
    $location.hash(id);
    $anchorScroll();
  };
});

