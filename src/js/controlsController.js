app.controller('controlsController', ['$scope', '$http', function($scope, $http) {
  $scope.data = {
    columns: [],
    types: {}
  };

  var customers = ['detailed-service-client1', 'detailed-service-client2', 'detailed-service-client3', 'detailed-service-client4'];

  for (var i in customers){
    loadRawData(customers[i]);
  }

  function loadRawData(source){
    $http.get('/api/collections/raw?take=50&query=' + JSON.stringify({ Source: source })).success(function(data){
      addDetailedClientDataSet(source, data, 'line');
    });
  }

  function addDetailedClientDataSet(name, dataSet, type){
    var kwh_c = [],
        kwh_g = [];
    for (var i in dataSet){
      kwh_c.push(dataSet[i].kwh_c);
      kwh_g.push(dataSet[i].kwh_g);
    }
    var name_kwh_c = name + '_kwh_c',
        name_kwh_g = name + '_kwh_g';
    kwh_c.unshift(name_kwh_c);
    kwh_g.unshift(name_kwh_g);

    addDataSet(name_kwh_c, kwh_c, type);
    addDataSet(name_kwh_g, kwh_g, type);
  }

  function addDataSet(name, dataSet, type){
    $scope.data.columns.push(dataSet);
    $scope.data.types[name] = type;
    $scope.chart.load($scope.data);
  }

  $scope.changeType = function(dataName, type){
    $scope.data.types[dataName] = type;
    $scope.chart.load($scope.data);
  };
}]);