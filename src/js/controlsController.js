app.controller('controlsController', ['$scope', '$http', function($scope, $http) {
  $scope.data = {
    columns: [],
    types: {}
  };

  $http.get('/api/collections/data1').success(function(data){
    addDataSet('data1', data, 'line');
  });
  $http.get('/api/collections/data2').success(function(data){
    addDataSet('data2', data, 'spline');
  });

  function addDataSet(name, dataSet, type){
    for (var i in dataSet){
      dataSet[i] = dataSet[i].val;
    }
    dataSet.unshift(name);
    $scope.data.columns.push(dataSet);
    $scope.data.types[name] = type;
    $scope.chart.load($scope.data);
  }

  $scope.changeType = function(dataName, type){
    $scope.data.types[dataName] = type;
    $scope.chart.load($scope.data);
  };
}]);