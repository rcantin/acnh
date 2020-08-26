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

myApp.controller("MainCtrl", function($scope, $http, serviceLocalStorage, serviceSessionStorage) {
  $scope.today = new Date();

  $scope.initCritters = function() {
    $scope.orderByField = "price";
    $scope.reverseSort = true;
    $scope.searchtext = "";
    $scope.lookuptype = "filter";
    $scope.crittertype = "fish";
    $scope.hemisphere = "northern";
    $scope.availmonth = "all";
    $scope.getCritterData($scope.crittertype);
  };

  $scope.initVillagers = function() {
    $scope.orderByField = "displayname";
    $scope.reverseSort = false;
    $scope.villagername = "";
    $scope.villagergender = "All";
    $scope.villagerhobby = "All";
    $scope.villagerpersonality = "All";
    $scope.villagerspecies = "All";
    $scope.getVillagerData();
  };

  $scope.initFossils = function() {
    $scope.orderByField = "displayname";
    $scope.reverseSort = false;
    $scope.fossilname = "";
    $scope.fossilgroup = "All";
    $scope.getFossilData();
  };

  $scope.initArt = function() {
    $scope.orderByField = "displayname";
    $scope.reverseSort = false;
    $scope.artname = "";
    $scope.getArtData();
  };

  $scope.getCritterData = function(crittertype) {
    $scope.crittersloaded = false;
    $scope.critters = [];
    console.log("Getting critter data from ACNHAPI...");
    $http({
      method: "GET",
      url: "https://acnhapi.com/v1/" + crittertype
    }).then(
      function successCallback(response) {
        critterdata = response.data;
        const items = Object.entries(critterdata);
        for (const item of items) {
          var names = item[1].name;
          item[1].displayname = names["name-USen"];
        }
        $scope.critters = critterdata;
        $scope.crittersloaded = true;
      },
      function errorCallback(response) {
        console.log("An error occurred getting data.", response);
      }
    );
  };

  $scope.getVillagerData = function() {
    $scope.villagersloaded = false;
    $scope.villagers = [];
    console.log("Getting villager data from ACNHAPI...");
    $http({
      method: "GET",
      url: "https://acnhapi.com/v1/villagers"
    }).then(
      function successCallback(response) {
        villagerdata = response.data;
        const items = Object.entries(villagerdata);
        for (const item of items) {
          var names = item[1].name;
          item[1].displayname = names["name-USen"];
        }
        $scope.villagers = villagerdata;
        $scope.buildVillagerDropdowns();
        $scope.villagersloaded = true;
      },
      function errorCallback(response) {
        console.log("An error occurred getting data.", response);
      }
    );
  };

  $scope.getFossilData = function() {
    $scope.fossilsloaded = false;
    $scope.fossils = [];
    console.log("Getting fossil data from ACNHAPI...");
    $http({
      method: "GET",
      url: "https://acnhapi.com/v1/fossils"
    }).then(
      function successCallback(response) {
        fossildata = response.data;
        const items = Object.entries(fossildata);
        for (const item of items) {
          var names = item[1].name;
          item[1].displayname = names["name-USen"];
        }
        $scope.fossils = fossildata;
        $scope.buildFossilDropdowns();
        $scope.fossilsloaded = true;
      },
      function errorCallback(response) {
        console.log("An error occurred getting data.", response);
      }
    );
  };

  $scope.getArtData = function() {
    $scope.artloaded = false;
    $scope.art = [];
    console.log("Getting art data from ACNHAPI...");
    $http({
      method: "GET",
      url: "https://acnhapi.com/v1/art"
    }).then(
      function successCallback(response) {
        artdata = response.data;
        const items = Object.entries(artdata);
        for (const item of items) {
          var names = item[1].name;
          item[1].displayname = names["name-USen"];
        }
        $scope.art = artdata;
        console.log(artdata);
        // $scope.buildArtDropdowns();
        $scope.artloaded = true;
      },
      function errorCallback(response) {
        console.log("An error occurred getting data.", response);
      }
    );
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

  $scope.buildFossilDropdowns = function() {
    var data = $scope.fossils;
    var allgroups = [];
    const items = Object.entries(data);
    for (const item of items) {
      allgroups.push(item[1]["part-of"]);
    }
    const unique = (value, index, self) => {
      return self.indexOf(value) === index;
    };
    const uniquegroups = allgroups.filter(unique);
    $scope.groups = uniquegroups;
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
    // console.log(result);
    return result;
  };
});

myApp.filter("trait", function() {
  return function(rows, filteron, selected) {
    // console.log(filteron, selected);
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
    // console.log(result);
    return result;
  };
});
