app.controller('controlsController', ['$scope', '$http', function($scope, $http) {
  $scope.types = ['line', 'spline', 'step', 'area', 'area-spline', 'area-step'];
  $scope.type = 'area-spline';

  $scope.$watch(function(scope){
    return scope.type;
  }, function(newValue){
    for (var i in $scope.data.types) {
      $scope.data.types[i] = newValue;
    }
    refreshChartData();
  });

  $scope.data = {
    x: 'x',
    columns: [
      ['x']
    ],
    types: {}
  };

  $http.get('json/productionData.json').success(function(data){
    console.log(data);
    var dates = ['x'].concat(_.pluck(data, 'year')),
        nuclear = ['nuclear'].concat(_.pluck(data, 'nuclear')),
        solar = ['solar'].concat(_.pluck(data, 'solar')),
        wind = ['wind'].concat(_.pluck(data, 'wind')),
        windSolar = ['wind solar'].concat(_.pluck(data, 'wind solar')),
        btuTotal = ['trillion BTU total'].concat(_.pluck(data, 'trillionBtuTotal')),
        mwTotal = ['MW total'].concat(_.pluck(data, 'MWTotal'));

    $scope.data.columns[0] = dates;
    addDataSet('nuclear', nuclear);
    addDataSet('solar', solar);
    addDataSet('wind', wind);
    addDataSet('wind solar', windSolar);
    addDataSet('trillion BTU total', btuTotal);
    addDataSet('MW total', mwTotal);
  });

  var customers = ['detailed-service-client1', 'detailed-service-client2', 'detailed-service-client3', 'detailed-service-client4'];
  // init w/ the detailed 4 customer data
//  for (var i in customers){
//    loadRawData(customers[i]);
//  }

  function loadRawData(source){
    $http.get('/api/collections/raw?take=100&query=' + JSON.stringify({ Source: source })).success(function(data){
      addDetailedClientDataSet(source, data);
    });
  }

  function addDetailedClientDataSet(name, dataSet){
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

    addDataSet(name_kwh_c, kwh_c);
    addDataSet(name_kwh_g, kwh_g);
  }

  function addDataSet(name, dataSet){
    $scope.data.columns.push(dataSet);
    $scope.data.types[name] = $scope.type;
    refreshChartData();
  }

  $scope.changeType = function(dataName, type){
    $scope.data.types[dataName] = type;
    refreshChartData();
  };

  function refreshChartData(){
    if ($scope.chart){
      $scope.chart.load($scope.data);
    }
  }

  function btuToMw(btu){
    return btu * 0.3;
  }
}]);