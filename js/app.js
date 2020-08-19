var myApp = angular.module("myApp", ["angular-toArrayFilter"]);

myApp.factory("serviceSessionStorage", [
  "$rootScope",
  function($rootScope) {
    return {
      get: function(key) {
        return JSON.parse(window.sessionStorage.getItem(key));
      },
      set: function(key, data) {
        window.sessionStorage.setItem(key, JSON.stringify(data));
      }
    };
  }
]);

myApp.factory("serviceLocalStorage", [
  "$rootScope",
  function($rootScope) {
    return {
      get: function(key) {
        return JSON.parse(window.localStorage.getItem(key));
      },
      set: function(key, data) {
        window.localStorage.setItem(key, JSON.stringify(data));
      }
    };
  }
]);

// myApp.service("dataService", function($http) {
//   delete $http.defaults.headers.common["X-Requested-With"];
//   this.getCritterData = function(callbackFunc, type) {
//     let url = "../data/" + type + ".json";
//     $http.get(url).then(function(data) {
//       callbackFunc(data);
//     });
//   };
//   this.getFishData = function(callbackFunc) {
//     $http.get("../data/fish.json").then(function(data) {
//       callbackFunc(data);
//     });
//   };
//   this.getSeaData = function(callbackFunc) {
//     $http.get("../data/sea.json").then(function(data) {
//       callbackFunc(data);
//     });
//   };
//   this.getBugData = function(callbackFunc) {
//     $http.get("../data/bug.json").then(function(data) {
//       callbackFunc(data);
//     });
//   };
// });

myApp.controller("MainCtrl", function($scope, $http, serviceLocalStorage) {
  $scope.today = new Date();

  $scope.initDetails = function() {
    $scope.orderByField = "price";
    $scope.reverseSort = true;
    $scope.searchtext = "";
    $scope.lookuptype = "filter";
    $scope.crittertype = "fish";
    $scope.hemisphere = "northern";
    $scope.availmonth = "all";
    $scope.getAllCritters();
  };

  $scope.initVillagers = function() {
    $scope.orderByField = "displayname";
    $scope.reverseSort = false;
    $scope.villagername = "";
    $scope.villagergender = "All";
    $scope.villagerhobby = "All";
    $scope.villagerpersonality = "All";
    $scope.villagerspecies = "All";
    $scope.getAllVillagers();
  };

  $scope.getAllCritters = function() {
    $scope.crittersloaded = false;
    $scope.critters = [];

    if (serviceLocalStorage.get("acnhcritters")) {
      console.log("Getting critter data from browser storage...");
      $scope.critters = serviceLocalStorage.get("acnhcritters");
      $scope.crittersloaded = true;
    } else {
      console.log("Getting critter data from JSON file...");
      $http({
        method: "GET",
        url: "./data/critters.json"
      }).then(
        function successCallback(response) {
          critterdata = response.data;
          $scope.critters = critterdata;
          $scope.crittersloaded = true;
          serviceLocalStorage.set("acnhcritters", critterdata);
        },
        function errorCallback(response) {
          console.log("An error occurred getting data.", response);
        }
      );
    }
  };

  $scope.getAllVillagers = function() {
    $scope.villagersloaded = false;
    $scope.villagers = [];

    if (serviceLocalStorage.get("acnhvillagers")) {
      console.log("Getting villager data from browser storage...");
      $scope.villagers = serviceLocalStorage.get("acnhvillagers");
      $scope.villagersloaded = true;
      $scope.buildVillagerDropdowns();
    } else {
      console.log("Getting critter data from JSON file...");
      $http({
        method: "GET",
        url: "./data/villagers.json"
      }).then(
        function successCallback(response) {
          villagerdata = response.data;

          const items = Object.entries(villagerdata);
          for (const item of items) {
            var names = item[1].name;
            item[1].displayname = names["name-USen"];
          }
          console.log(villagerdata);
          $scope.villagers = villagerdata;
          $scope.villagersloaded = true;
          serviceLocalStorage.set("acnhvillagers", villagerdata);
          $scope.buildVillagerDropdowns();
        },
        function errorCallback(response) {
          console.log("An error occurred getting data.", response);
        }
      );
    }
  };

  $scope.buildVillagerDropdowns = function() {
    var data = $scope.villagers;
    var allgenders = [];
    var allhobbies = [];
    var allpersonalities = [];
    var allspecies = [];
    const items = Object.entries(data);
    for (const item of items) {
      allgenders.push(item[1].gender);
      allhobbies.push(item[1].hobby);
      allpersonalities.push(item[1].personality);
      allspecies.push(item[1].species);
    }
    const unique = (value, index, self) => {
      return self.indexOf(value) === index;
    };
    const uniquegenders = allgenders.filter(unique);
    $scope.genders = uniquegenders;
    const uniquehobbies = allhobbies.filter(unique);
    $scope.hobbies = uniquehobbies;
    const uniquepersonalities = allpersonalities.filter(unique);
    $scope.personalities = uniquepersonalities;
    const uniquespecies = allspecies.filter(unique);
    $scope.species = uniquespecies;
  };
});

myApp.filter("search", function() {
  return function(rows, lookuptype, searchtext) {
    var expected = ("" + searchtext).toLowerCase();
    var result = [];
    if (!lookuptype) {
      for (var i = 0; i < rows.length; i++) {
        var actual = ("" + rows[i].displayname).toLowerCase();
        if (actual.indexOf(expected) !== -1) {
          result.push(rows[i]);
        }
      }
    }
    if (lookuptype == "filter") {
      for (var i = 0; i < rows.length; i++) {
        rows[i].highlight = false;
        var actual = ("" + rows[i].displayname).toLowerCase();
        if (actual.indexOf(expected) !== -1) {
          result.push(rows[i]);
        }
      }
    }
    if (lookuptype == "highlight") {
      for (var i = 0; i < rows.length; i++) {
        rows[i].highlight = false;
        if (searchtext) {
          var actual = ("" + rows[i].displayname).toLowerCase();
          if (actual.indexOf(expected) !== -1) {
            rows[i].highlight = true;
          }
        }
        result.push(rows[i]);
      }
    }
    // console.log(result);
    return result;
  };
});

myApp.filter("bymonth", function() {
  return function(rows, availmonth, hemisphere) {
    var result = [];
    for (var i = 0; i < rows.length; i++) {
      if (availmonth == "all") {
        result.push(rows[i]);
      } else {
        if (rows[i].availability.isAllYear) {
          result.push(rows[i]);
        } else {
          if (hemisphere == "northern") {
            if (rows[i].availability["month-array-northern"].includes(availmonth)) {
              result.push(rows[i]);
            }
          }
          if (hemisphere == "southern") {
            if (rows[i].availability["month-array-southern"].includes(availmonth)) {
              result.push(rows[i]);
            }
          }
        }
      }
    }
    console.log(result);
    return result;
  };
});

myApp.filter("trait", function() {
  return function(rows, filteron, selected) {
    console.log(filteron, selected);
    var result = [];
    for (var i = 0; i < rows.length; i++) {
      if (selected == "All") {
        result.push(rows[i]);
      } else {
        if (rows[i][filteron] == selected) {
          result.push(rows[i]);
        }
      }
    }
    console.log(result);
    return result;
  };
});
