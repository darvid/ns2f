'use strict';

angular.module('projectsApp')
  .controller('MainCtrl', function($scope, $http, firewall) {
    $scope.denyOutput = true;
    $scope.denyForward = "REJECT";
    $scope.firewall = firewall;

    $scope.$watch('netstat', function(data) {
      firewall.parseNetstat(data);
    });

    // $http.get('services.json').success(function(data) {
    //   $scope.services = data;
    // });
  });
