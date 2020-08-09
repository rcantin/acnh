var myApp = angular.module("myApp", []);

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

myApp.service("dataService", function($http) {
  delete $http.defaults.headers.common["X-Requested-With"];
  this.getFishData = function(callbackFunc) {
    $http.get("https://acnhapi.com/v1/fish").then(function(data) {
      callbackFunc(data);
    });
  };
  this.getSeaData = function(callbackFunc) {
    $http.get("https://acnhapi.com/v1/sea").then(function(data) {
      callbackFunc(data);
    });
  };
  this.getBugData = function(callbackFunc) {
    $http.get("https://acnhapi.com/v1/bugs").then(function(data) {
      callbackFunc(data);
    });
  };
});

myApp.controller("MainCtrl", function($scope, dataService, serviceLocalStorage) {
  $scope.today = new Date();

  $scope.init = function() {
    if (!serviceLocalStorage.get("acnhcritters_fish") || !serviceLocalStorage.get("acnhcritters_sea") || !serviceLocalStorage.get("acnhcritters_bugs")) {
      console.log("Getting Critters from server API");
      $scope.getCritterData();
    }
    $scope.setCritterData();
  };

  $scope.getCritterData = function() {
    var dataset = new Array();
    dataService.getFishData(function(fishdata) {
      var fish = fishdata.data;
      for (key in fish) {
        fish[key]["type"] = "fish";
        const namesarr = Object.entries(fish[key].name);
        for (i = 0; i < namesarr.length; i++) {
          if (namesarr[i][0] == "name-USen") {
            setname = namesarr[i][1];
          }
        }
        fish[key]["displayname"] = setname;
        dataset.push(fish[key]);
      }
      serviceLocalStorage.set("acnhcritters_fish", fish);
    });
    dataService.getSeaData(function(seadata) {
      var sea = seadata.data;
      for (key in sea) {
        sea[key]["type"] = "sea";
        const namesarr = Object.entries(sea[key].name);
        for (i = 0; i < namesarr.length; i++) {
          if (namesarr[i][0] == "name-USen") {
            setname = namesarr[i][1];
          }
        }
        sea[key]["displayname"] = setname;
        dataset.push(sea[key]);
      }
      serviceLocalStorage.set("acnhcritters_sea", sea);
    });
    dataService.getBugData(function(bugdata) {
      var bugs = bugdata.data;
      for (key in bugs) {
        bugs[key]["type"] = "bug";
        const namesarr = Object.entries(bugs[key].name);
        for (i = 0; i < namesarr.length; i++) {
          if (namesarr[i][0] == "name-USen") {
            setname = namesarr[i][1];
          }
        }
        bugs[key]["displayname"] = setname;
        dataset.push(bugs[key]);
      }
      serviceLocalStorage.set("acnhcritters_bugs", bugs);
    });
  };

  $scope.setCritterData = function() {
    var setdata = new Array();
    switch ($scope.crittertype) {
      case "fish":
        setdata = serviceLocalStorage.get("acnhcritters_fish");
        break;
      case "sea":
        setdata = serviceLocalStorage.get("acnhcritters_sea");
        break;
      case "bug":
        setdata = serviceLocalStorage.get("acnhcritters_bugs");
        break;
    }
    var result = Object.keys(setdata).map(function(key) {
      return setdata[key];
    });
    $scope.critters = result;
  };

  $scope.orderByField = "price";
  $scope.reverseSort = true;
  $scope.searchtext = "";
  $scope.searchtype = "filter";
  $scope.crittertype = "fish";
});
