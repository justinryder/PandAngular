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
    Solar: [],
    Wind: []
  };

  $scope.proposedEvent = {
    location: '',
    type: '',
    btuDelta: 0,
    year: new Date().getFullYear()
  };

  $scope.minYear = new Date().getFullYear();
  $scope.maxYear = 2050;

  $scope.saveProject = function(type) {
    var btu = 0;

    if(type === 'Wind') {
      btu = 6;
    } else if(type === 'Solar') {
      btu = 1;
    }
    addEvent(type, btu, $scope.proposedEvent.year, $scope.proposedEvent.location, true);
  };

  $scope.addProject = function(powerType, btuDelta, date, location, name) {
    addEvent(powerType, btuDelta, date, location, name, true);
  };

  $http.get('json/productionData.json').success(function(data){
    dates = ['x'].concat(_.pluck(data, 'year'));
    nuclear = ['Nuclear'].concat(_.pluck(data, 'nuclear'));
    solar = ['Solar'].concat(_.pluck(data, 'solar'));
    wind = ['Wind'].concat(_.pluck(data, 'wind'));
    windSolar = ['Wind & Solar'].concat(_.pluck(data, 'wind solar'));
    btuTotal = ['Trillion BTU Total'].concat(_.pluck(data, 'trillionBtuTotal'));
    mwTotal = ['MegaWatt Total'].concat(_.pluck(data, 'MWTotal'));

    addPlannedEvents();
  });

  function addPlannedEvents() {
    addEvent('Solar', 1, 2023, 'Richmond', 'Super Solar', 'some description' false);
    addEvent('Wind', 6, 2017, 'Middlebury', 'Epic Winds');
  }

  function addEvent(powerType, btuDelta, date, location, name, description, shouldRefresh){
    var e = {
      name: name,
      description: description,
      type: powerType,
      btuDelta: btuDelta,
      date: date,
      location: location
    };
    $scope.events[powerType].push(e);
    if (typeof shouldRefresh === 'undefined' || shouldRefresh){
      applyEventsToChartData();
    }
  }

  function applyEventsToChartData(){
    $scope.data.columns = [];
    $scope.data.columns[0] = dates;

    var _solar = solar.concat([]),
        _wind = wind.concat([]);

    _.each($scope.events.Solar, function(e){ applyEventToDataSet(_solar, e); });
    _.each($scope.events.Wind, function(e){ applyEventToDataSet(_wind, e); });

    addDataSet('Nuclear', nuclear);
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
    for (var i in $scope.events){
      var index = $scope.events[i].indexOf(e);
      if (index > -1){
        $scope.events[i].splice(index, 1);
        applyEventsToChartData();
      }
    }
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

  $scope.changeType = function(dataName, type){
    $scope.data.types[dataName] = type;
    refreshChartData();
  };

  function refreshChartData(){
    if ($scope.chart){
      $scope.chart.load($scope.data);

      var gridLines = [
          { value: 1972, text: 'VT Yankee Begins Operation' },
          { value: new Date().getFullYear(), text: 'Today' }
        ],
          events = $scope.events.Solar.concat($scope.events.Wind);
      for (var i in events){
        var e = events[i];
        gridLines.push({ value: e.date, text: e.type + ' Project @ ' + e.location });
      }
      $scope.chart.xgrids(gridLines);
    }
  }

  function btuToMw(btu){
    return btu * 0.3;
  }
}]);