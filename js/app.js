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
});

myApp.controller("MainCtrl", function($scope, dataService, serviceLocalStorage) {
  $scope.today = new Date();

  $scope.getFishData = function() {
    if (serviceLocalStorage.get("acnhfish")) {
      console.log("Getting data from Local Storage");
      var setdata = serviceLocalStorage.get("acnhfish");
      var readydata = $scope.transformData(setdata);
      $scope.acnhdata = readydata;
    } else {
      dataService.getFishData(function(acnhdata) {
        console.log("Getting data from ACNH Server API");
        serviceLocalStorage.set("acnhfish", acnhdata.data);
        var setdata = acnhdata.data;
        var readydata = $scope.transformData(setdata);
        $scope.acnhdata = readydata;
      });
    }
    console.log($scope.acnhdata);
  };

  $scope.orderByField = "displayname";
  $scope.reverseSort = false;
  $scope.searchtext = "";

  $scope.transformData = function(setdata) {
    console.log("Transforming Data...");
    var data = setdata;
    var setname;
    for (key in data) {
      const namesarr = Object.entries(data[key].name);
      for (i = 0; i < namesarr.length; i++) {
        if (namesarr[i][0] == "name-USen") {
          setname = namesarr[i][1];
        }
      }
      data[key].displayname = setname;
    }
    return Object.keys(data).map(function(key) {
      return data[key];
    });
  };
});
