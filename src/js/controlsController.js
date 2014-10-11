app.controller('controlsController', ['$scope', '$timeout', function($scope, $timeout) {
  $timeout(function(){
    $scope.chart.transform('line', 'data1');
  }, 2000);
}]);