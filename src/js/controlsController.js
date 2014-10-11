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

  var dates,
      nuclear,
      solar,
      wind,
      windSolar,
      btuTotal,
      mwTotal;
  
  $scope.events = {
    nuclear: [],
    solar: [],
    wind: []
  };

  $scope.proposedProjects = [];

  $scope.proposedProjectLocation = '';
  $scope.proposedProjectYear = new Date().getFullYear();
  $scope.minYear = new Date().getFullYear();
  $scope.maxYear = 2050;
  $scope.saveProject = function() {
    console.log($scope.proposedProjectYear);
    console.log('wft');
  };

  $http.get('json/productionData.json').success(function(data){
    console.log(data);
    dates = ['x'].concat(_.pluck(data, 'year'));
    nuclear = ['Nuclear'].concat(_.pluck(data, 'nuclear'));
    solar = ['Solar'].concat(_.pluck(data, 'solar'));
    wind = ['Wind'].concat(_.pluck(data, 'wind'));
    windSolar = ['Wind & Solar'].concat(_.pluck(data, 'wind solar'));
    btuTotal = ['Trillion BTU Total'].concat(_.pluck(data, 'trillionBtuTotal'));
    mwTotal = ['MegaWatt Total'].concat(_.pluck(data, 'MWTotal'));

    applyEventsToChartData();
  });

  function addEvent(powerType, btuDelta, date){
    var e = {
      btuDelta: btuDelta,
      date: date
    };
    events[powerType].push(e);
    applyEventsToChartData();
  }

  function applyEventsToChartData(){
    $scope.data.columns = [];
    $scope.data.columns[0] = dates;

    var _nuclear = nuclear.concat([]),
        _solar = solar.concat([]),
        _wind = wind.concat([]);

    _.each($scope.events.nuclear, function(e){ applyEventToDataSet(_nuclear, e); });
    _.each($scope.events.solar, function(e){ applyEventToDataSet(_solar, e); });
    _.each($scope.events.wind, function(e){ applyEventToDataSet(_wind, e); });

    addDataSet('Nuclear', _nuclear);
    addDataSet('Solar', _solar);
    addDataSet('Wind', _wind);
    //addDataSet('Wind & Solar', windSolar);
    //addDataSet('Total', btuTotal);
    //addDataSet('MegaWatt Total', mwTotal);
  }

  function applyEventToDataSet(dataSet, e){
    for (var i = 0; i < dataSet.length; i++){
      if (dates[i] >= e.date){
        dataSet[i] = dataSet[i] + e.btuDelta;
      }
    }
  }

  $scope.removeEvent = function(e){
    for (var i in events){
      var index = events[i].indexOf(e);
      if (index > -1){
        delete events[i][index];
      }
    }
  };

  $scope.addDummyEvent = function(){
    addEvent('solar', 10, 2030);
  };

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

  function addEnergyEvent(name, productionIncrease) {
    // $scope.data.columns
    // $scope.data.types[name] = $scope.type;
    // refreshChartData();
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