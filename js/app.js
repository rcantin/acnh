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

  $scope.init = function() {
    $scope.orderByField = "price";
    $scope.reverseSort = true;
    $scope.searchtext = "";
    $scope.lookuptype = "filter";
    $scope.crittertype = "fish";
    $scope.hemisphere = "northern";
    $scope.availmonth = "all";
    $scope.getAllCritters();
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

  // $("#modalDetails").on("show.bs.modal", function(event) {
  //   var opener = $(event.relatedTarget); // opener that triggered the modal
  //   var recipient = opener.data("file-name"); // Extract info from data-* attributes
  //   var critters = Object.values($scope.critters);

  //   var result = critters.filter(obj => {
  //     return obj["file-name"] === recipient;
  //   });
  //   console.log(result);
  //   $scope.detailmodalcontent = result;
  // });
});

myApp.filter("search", function() {
  return function(rows, lookuptype, searchtext) {
    var expected = ("" + searchtext).toLowerCase();
    var result = [];
    console.log(rows);
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
