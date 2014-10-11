app.controller('graphController', ['$scope', '$timeout', function($scope, $timeout) {
  $scope.data = {
    columns: [
      ['data1', 30, 200, 100, 400, 150, 250],
      ['data2', 50, 20, 10, 40, 15, 25]
    ],
    types: {
      data1: 'spline',
      data2: 'area-step'
    }
  };
}]);