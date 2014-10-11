app.controller('controlsController', ['$scope', '$http', function($scope, $http) {
  $scope.data = {
    x: 'x',
    columns: [
      ['x']
    ],
    types: {}
  };

  var customers = ['detailed-service-client1', 'detailed-service-client2', 'detailed-service-client3', 'detailed-service-client4'];

  for (var i in customers){
    loadRawData(customers[i]);
  }

  function loadRawData(source){
    $http.get('/api/collections/raw?take=100&query=' + JSON.stringify({ Source: source })).success(function(data){
      addDetailedClientDataSet(source, data, 'line');
    });
  }

  function addDetailedClientDataSet(name, dataSet, type){
    var kwh_c = [],
        kwh_g = [],
        dates = [];
    for (var i in dataSet){
      kwh_c.push(dataSet[i].kwh_c);
      kwh_g.push(dataSet[i].kwh_g);
      var date = new Date(Date.parse(dataSet[i].dt));
      dates.push(date);
    }
    dates.unshift('x');
    $scope.data.columns[0] = dates;

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
    refreshChartData();  }

  $scope.changeType = function(dataName, type){
    $scope.data.types[dataName] = type;
    refreshChartData();
  };

  function refreshChartData(){
    $scope.chart.load($scope.data);
  }
}]);