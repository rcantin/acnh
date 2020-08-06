var myApp = angular.module("myApp", []);

myApp.controller("MainCtrl", function($scope) {
  $scope.today = new Date();
});
